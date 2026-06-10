"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { ConfiguracoesValues } from "./types"

interface ConfiguracoesFormProps {
  values: ConfiguracoesValues
  onChange: (field: keyof ConfiguracoesValues, value: string | boolean) => void
  onSave: () => void
}

export default function ConfiguracoesForm({
  values,
  onChange,
  onSave,
}: ConfiguracoesFormProps) {
  return (
    <form className="grid gap-6">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="terminalName">Nome do terminal</Label>
          <Input
            id="terminalName"
            value={values.terminalName}
            onChange={(event) => onChange("terminalName", event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="defaultPaymentMethod">Pagamento padrão</Label>
          <Input
            id="defaultPaymentMethod"
            value={values.defaultPaymentMethod}
            onChange={(event) =>
              onChange("defaultPaymentMethod", event.target.value)
            }
          />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="appearance">Aparência</Label>
          <Select
            value={values.appearance}
            onValueChange={(value) => onChange("appearance", value)}
          >
            <SelectTrigger id="appearance">
              <SelectValue placeholder="Selecione um modo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="receiptLayout">Layout do recibo</Label>
          <Select
            value={values.receiptLayout}
            onValueChange={(value) => onChange("receiptLayout", value)}
          >
            <SelectTrigger id="receiptLayout">
              <SelectValue placeholder="Selecione um layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Padrão</SelectItem>
              <SelectItem value="compact">Compacto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-muted p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Fechamento automático
            </p>
            <p className="text-sm text-muted-foreground">
              Habilita fechamento de caixa ao final do turno.
            </p>
          </div>
          <Switch
            checked={values.automaticCashClose}
            onCheckedChange={(checked: string | boolean) =>
              onChange("automaticCashClose", checked)
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={onSave} className="gap-2">
          Salvar configurações
        </Button>
      </div>
    </form>
  )
}
