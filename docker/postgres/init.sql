-- ============================================================================
-- Sector Universal Learning Platform - PostgreSQL Initialization
-- ============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin', 'researcher');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE oauth_provider AS ENUM ('github', 'google');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_visibility AS ENUM ('private', 'shared', 'public');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE run_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled', 'timeout');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE trace_event_type AS ENUM (
        'line_execution', 'variable_change', 'function_call', 'error', 
        'output', 'memory_usage', 'cpu_usage', 'breakpoint', 'step'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prompt_status AS ENUM ('pending', 'streaming', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('pdf', 'book', 'markdown', 'text', 'code');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE visualization_type AS ENUM (
        'execution_tree', 'data_structure', 'ast_walk', 'neural_network',
        'compiler_phases', 'memory_layout', 'call_graph', 'dependency_graph'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE export_format AS ENUM ('pdf', 'png', 'jpeg', 'svg', 'docx', 'pptx');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE sector_dev TO sector_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO sector_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sector_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sector_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO sector_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO sector_user;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_source_files_project ON source_files(project_id);
CREATE INDEX IF NOT EXISTS idx_source_files_language ON source_files(language);
CREATE INDEX IF NOT EXISTS idx_source_files_path ON source_files(path);

CREATE INDEX IF NOT EXISTS idx_runs_project ON runs(project_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_language ON runs(language);
CREATE INDEX IF NOT EXISTS idx_runs_created ON runs(created_at);

CREATE INDEX IF NOT EXISTS idx_trace_events_run ON trace_events(run_id);
CREATE INDEX IF NOT EXISTS idx_trace_events_type ON trace_events(type);
CREATE INDEX IF NOT EXISTS idx_trace_events_timestamp ON trace_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_trace_events_line ON trace_events(line_number);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_projects_search ON projects USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_source_files_search ON source_files USING GIN(to_tsvector('english', name || ' ' || content));

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_runs_project_status ON runs(project_id, status);
CREATE INDEX IF NOT EXISTS idx_trace_events_run_type ON trace_events(run_id, type);

-- Create partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_users_active ON users(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_projects_public ON projects(id) WHERE visibility = 'public';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_source_files_updated_at BEFORE UPDATE ON source_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_runs_updated_at BEFORE UPDATE ON runs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate project statistics
CREATE OR REPLACE FUNCTION get_project_stats(project_uuid UUID)
RETURNS TABLE(
    file_count BIGINT,
    run_count BIGINT,
    last_run_status TEXT,
    total_runtime BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(sf.id)::BIGINT as file_count,
        COUNT(r.id)::BIGINT as run_count,
        r.status::TEXT as last_run_status,
        COALESCE(SUM(r.duration), 0)::BIGINT as total_runtime
    FROM projects p
    LEFT JOIN source_files sf ON p.id = sf.project_id
    LEFT JOIN runs r ON p.id = r.project_id
    WHERE p.id = project_uuid
    GROUP BY p.id, r.status
    ORDER BY r.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to search projects
CREATE OR REPLACE FUNCTION search_projects(search_term TEXT, user_uuid UUID)
RETURNS TABLE(
    id UUID,
    name TEXT,
    description TEXT,
    visibility TEXT,
    tags TEXT[],
    owner_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.visibility::TEXT,
        p.tags,
        p.owner_id,
        p.created_at,
        p.updated_at,
        ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', search_term)) as relevance
    FROM projects p
    WHERE (
        p.visibility = 'public' OR 
        p.owner_id = user_uuid OR
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = user_uuid AND u.role IN ('admin', 'teacher')
        )
    )
    AND to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', search_term)
    ORDER BY relevance DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user activity
CREATE OR REPLACE FUNCTION get_user_activity(user_uuid UUID, days INTEGER DEFAULT 30)
RETURNS TABLE(
    date DATE,
    projects_created INTEGER,
    runs_executed INTEGER,
    files_modified INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.date,
        COALESCE(pc.count, 0) as projects_created,
        COALESCE(re.count, 0) as runs_executed,
        COALESCE(fm.count, 0) as files_modified
    FROM generate_series(
        CURRENT_DATE - INTERVAL '1 day' * days,
        CURRENT_DATE,
        INTERVAL '1 day'
    ) AS d(date)
    LEFT JOIN (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM projects
        WHERE owner_id = user_uuid
        GROUP BY DATE(created_at)
    ) pc ON d.date = pc.date
    LEFT JOIN (
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM runs
        WHERE project_id IN (SELECT id FROM projects WHERE owner_id = user_uuid)
        GROUP BY DATE(created_at)
    ) re ON d.date = re.date
    LEFT JOIN (
        SELECT DATE(updated_at) as date, COUNT(*) as count
        FROM source_files
        WHERE project_id IN (SELECT id FROM projects WHERE owner_id = user_uuid)
        GROUP BY DATE(updated_at)
    ) fm ON d.date = fm.date
    ORDER BY d.date DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_project_stats(UUID) TO sector_user;
GRANT EXECUTE ON FUNCTION search_projects(TEXT, UUID) TO sector_user;
GRANT EXECUTE ON FUNCTION get_user_activity(UUID, INTEGER) TO sector_user;

-- Create views for common queries
CREATE OR REPLACE VIEW project_overview AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.visibility,
    p.tags,
    p.owner_id,
    u.username as owner_username,
    u.display_name as owner_display_name,
    p.created_at,
    p.updated_at,
    p.last_run_at,
    COUNT(DISTINCT sf.id) as file_count,
    COUNT(DISTINCT r.id) as run_count,
    COUNT(DISTINCT CASE WHEN r.status = 'completed' THEN r.id END) as successful_runs,
    COUNT(DISTINCT CASE WHEN r.status = 'failed' THEN r.id END) as failed_runs,
    COALESCE(AVG(r.duration), 0) as avg_runtime
FROM projects p
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN source_files sf ON p.id = sf.project_id
LEFT JOIN runs r ON p.id = r.project_id
GROUP BY p.id, u.username, u.display_name;

-- Grant select permissions on views
GRANT SELECT ON project_overview TO sector_user;

-- Create materialized view for analytics (refresh manually or via cron)
CREATE MATERIALIZED VIEW IF NOT EXISTS user_analytics AS
SELECT 
    u.id,
    u.username,
    u.display_name,
    u.role,
    u.created_at,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT CASE WHEN p.visibility = 'public' THEN p.id END) as public_projects,
    COUNT(DISTINCT r.id) as total_runs,
    COUNT(DISTINCT CASE WHEN r.status = 'completed' THEN r.id END) as successful_runs,
    COUNT(DISTINCT CASE WHEN r.status = 'failed' THEN r.id END) as failed_runs,
    COALESCE(SUM(r.duration), 0) as total_runtime,
    COALESCE(AVG(r.duration), 0) as avg_runtime,
    MAX(r.created_at) as last_run_at
FROM users u
LEFT JOIN projects p ON u.id = p.owner_id
LEFT JOIN runs r ON p.id = r.project_id
GROUP BY u.id, u.username, u.display_name, u.role, u.created_at;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_user_analytics_username ON user_analytics(username);
CREATE INDEX IF NOT EXISTS idx_user_analytics_role ON user_analytics(role);

-- Grant select permissions on materialized view
GRANT SELECT ON user_analytics TO sector_user;

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_analytics;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION refresh_analytics() TO sector_user;

-- Insert initial configuration
INSERT INTO pg_settings (name, setting, unit, category, short_desc, extra_desc, context, vartype, min_val, max_val, enumvals, boot_val, reset_val, source, sourcefile, sourceline)
VALUES 
    ('shared_preload_libraries', 'pg_stat_statements', NULL, 'Statistics / Monitoring', 'Preload shared libraries at startup', 'This parameter allows shared libraries to be preloaded at server startup.', 'postmaster', 'string', NULL, NULL, NULL, '', '', 'default', NULL, NULL),
    ('pg_stat_statements.track', 'all', NULL, 'Statistics / Monitoring', 'Selects which statements to track', 'Specifies which statements are tracked by pg_stat_statements.', 'superuser', 'enum', NULL, NULL, '{none, top, all}', 'top', 'top', 'default', NULL, NULL)
ON CONFLICT (name) DO NOTHING;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Sector Universal Learning Platform database initialization completed successfully!';
    RAISE NOTICE 'Database: %', current_database();
    RAISE NOTICE 'User: %', current_user;
    RAISE NOTICE 'Schema: %', current_schema;
END $$;
