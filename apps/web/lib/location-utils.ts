interface LocationData {
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  ipAddress?: string
}

// Check if IP is localhost or private
function isPrivateIP(ip: string): boolean {
  if (!ip) return true
  
  // Handle IPv6 localhost
  if (ip === '::1' || ip === 'localhost') return true
  
  // Handle IPv4 localhost
  if (ip === '127.0.0.1') return true
  
  // Handle private IP ranges
  const privateRanges = [
    /^10\./,                    // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^192\.168\./,              // 192.168.0.0/16
    /^169\.254\./,              // 169.254.0.0/16 (link-local)
    /^fc00::/,                  // Unique local addresses
    /^fe80::/                   // Link-local addresses
  ]
  
  return privateRanges.some(range => range.test(ip))
}

export async function detectLocation(): Promise<LocationData> {
  try {
    
    // Get IP address from a public service
    const ipResponse = await fetch('https://api.ipify.org?format=json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LocationDetector/1.0)'
      }
    })
    
    if (!ipResponse.ok) {
      throw new Error(`IP service responded with ${ipResponse.status}`)
    }
    
    const ipData = await ipResponse.json()
    const ipAddress = ipData.ip

    // Check if it's a private IP
    if (isPrivateIP(ipAddress)) {
      return {
        ipAddress,
        city: 'Local Development',
        country: 'Development Environment',
        latitude: undefined,
        longitude: undefined,
      }
    }

    // Get location data from IP with timeout and retry
    const locationResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LocationDetector/1.0)'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    if (!locationResponse.ok) {
      throw new Error(`Location service responded with ${locationResponse.status}`)
    }
    
    const locationData = await locationResponse.json()

    const result = {
      ipAddress,
      city: locationData.city || undefined,
      country: locationData.country_name || locationData.country || undefined,
      latitude: locationData.latitude || undefined,
      longitude: locationData.longitude || undefined,
    }
    
    return result
  } catch (error) {
    return {}
  }
}

export async function getLocationFromIP(ipAddress: string): Promise<LocationData> {
  try {
    
    // Check if it's a private IP
    if (isPrivateIP(ipAddress)) {
      return {
        ipAddress,
        city: 'Localhost',
        country: 'Development',
        latitude: undefined,
        longitude: undefined,
      }
    }

    // Try multiple location services for better reliability
    const services = [
      `https://ipapi.co/${ipAddress}/json/`,
      `https://ip-api.com/json/${ipAddress}`,
      `https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${ipAddress}`
    ]

    for (const serviceUrl of services) {
      try {
        const response = await fetch(serviceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; LocationDetector/1.0)'
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout per service
        })
        
        if (!response.ok) {
          continue
        }
        
        const data = await response.json()
        
        // Handle different service response formats
        let city, country, latitude, longitude
        
        if (serviceUrl.includes('ipapi.co')) {
          city = data.city
          country = data.country_name || data.country
          latitude = data.latitude
          longitude = data.longitude
        } else if (serviceUrl.includes('ip-api.com')) {
          city = data.city
          country = data.country
          latitude = data.lat
          longitude = data.lon
        } else if (serviceUrl.includes('ipgeolocation.io')) {
          city = data.city
          country = data.country_name
          latitude = data.latitude
          longitude = data.longitude
        }
        
        const result = {
          ipAddress,
          city: city || undefined,
          country: country || undefined,
          latitude: latitude || undefined,
          longitude: longitude || undefined,
        }
        
        return result
        
      } catch (serviceError) {
        continue
      }
    }
    
    // If all services fail, return IP only
    return { ipAddress }
    
  } catch (error) {
    return { ipAddress }
  }
}

export function formatLocation(city?: string, country?: string): string {
  if (city && country) {
    return `${city}, ${country}`
  } else if (city) {
    return city
  } else if (country) {
    return country
  }
  return 'Unknown Location'
} 