"use client"

import type React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface Column {
  key: string
  title: string
  render?: (value: any, row: any) => React.ReactNode
}

interface ResponsiveTableProps {
  columns: Column[]
  data: any[]
  emptyMessage?: string
}

export function ResponsiveTable({ columns, data, emptyMessage = "No data available" }: ResponsiveTableProps) {
  const isMobile = useIsMobile()

  if (data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row, rowIndex) => (
          <Card key={rowIndex} className="p-4">
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between py-2 border-b last:border-0">
                <span className="font-medium">{column.title}</span>
                <span>{column.render ? column.render(row[column.key], row) : row[column.key]}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
