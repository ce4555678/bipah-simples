"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ConfiguracoesSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function ConfiguracoesSection({
  title,
  description,
  children,
}: ConfiguracoesSectionProps) {
  return (
    <Card className="rounded-3xl border border-border bg-background shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
    </Card>
  )
}
