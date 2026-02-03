'use client'

import * as React from 'react'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface TextFieldProps {
  name: string
  label?: React.ReactNode
  placeholder?: string
  maxLength?: number
  className?: string
  style?: React.CSSProperties
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export function TextField({
  name,
  placeholder,
  maxLength = 64,
  className,
  style,
  inputProps,
}: TextFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              {...inputProps}
              placeholder={placeholder}
              maxLength={maxLength}
              className={cn(
                'slavic-input tablet-border placeholder:text-accent',
                className,
                fieldState.error && 'border-destructive text-destructive placeholder:text-destructive',
              )}
              style={{ background: 'transparent', ...style }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default TextField


