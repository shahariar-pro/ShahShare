'use client'

import { useState } from 'react'
import { Lock, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ShareOptionsProps {
  options: {
    password: string
    expiryDays: number
    description: string
  }
  onChange: (options: {
    password: string
    expiryDays: number
    description: string
  }) => void
}

export default function ShareOptions({ options, onChange }: ShareOptionsProps) {
  const [timeUnit, setTimeUnit] = useState<'hours' | 'days'>('days')

  const handleExpiryChange = (value: number) => {
    onChange({
      ...options,
      expiryDays: value,
    })
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="text-sm font-semibold mb-4">Share Options</h3>

      <div className="space-y-4">
        {/* Description */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            Description (optional)
          </Label>
          <textarea
            value={options.description}
            onChange={(e) =>
              onChange({ ...options, description: e.target.value })
            }
            placeholder="Add a message for the recipient..."
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={3}
          />
        </div>

        {/* Password */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4" />
            Password (optional)
          </Label>
          <Input
            type="password"
            value={options.password}
            onChange={(e) =>
              onChange({ ...options, password: e.target.value })
            }
            placeholder="Leave empty for no password"
            className="bg-input"
          />
        </div>

        {/* Expiry Time */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            Expires in
          </Label>
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant={timeUnit === 'hours' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeUnit('hours')}
              className="flex-1"
            >
              Hours
            </Button>
            <Button
              type="button"
              variant={timeUnit === 'days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeUnit('days')}
              className="flex-1"
            >
              Days
            </Button>
          </div>
          <Input
            type="number"
            min="1"
            max={timeUnit === 'hours' ? 240 : 30}
            value={options.expiryDays}
            onChange={(e) => handleExpiryChange(Math.max(1, Math.min(timeUnit === 'hours' ? 240 : 30, Number(e.target.value))))}
            placeholder={timeUnit === 'hours' ? 'Enter hours (1-240)' : 'Enter days (1-30)'}
            className="bg-input"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {timeUnit === 'hours' 
              ? 'Content will be deleted after specified hours' 
              : 'Content will be deleted after specified days'}
          </p>
        </div>
      </div>
    </Card>
  )
}
