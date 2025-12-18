// components/parcel/ParcelEditForm.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parcelSchema, type ParcelFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Trash2, Hash } from 'lucide-react'

interface ParcelEditFormProps {
  parcel: any
  onSuccess: () => void
  onCancel: () => void
}

export default function ParcelEditForm({ parcel, onSuccess, onCancel }: ParcelEditFormProps) {
  const [items, setItems] = useState<
    Array<{
      id: string
      description: string
      serialNumbers: Array<{ id: string; serialNumber: string }>
    }>
  >(
    parcel.items?.map((item: any, index: number) => ({
      id: item.id || `item-${index}`,
      description: item.description || '',
      serialNumbers: item.serialNumbers?.map((sn: any, snIndex: number) => ({
        id: sn.id || `sn-${index}-${snIndex}`,
        serialNumber: sn.serialNumber || '',
      })) || [{ id: `sn-${index}-0`, serialNumber: '' }],
    })) || [],
  )
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ParcelFormData>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      from: parcel.from,
      senderType: parcel.senderType,
      to: parcel.to,
      weight: parcel.weight || '',
      dimensions: parcel.dimensions || '',
      notes: parcel.notes || '',
      items: parcel.items || [],
    },
  })

  const senderTypeValue = watch('senderType')

  const onSubmit = async (data: ParcelFormData) => {
    try {
      setLoading(true)

      const formattedData = {
        ...data,
        items: items.map((item) => ({
          description: item.description,
          serialNumbers: item.serialNumbers.map((sn) => ({ serialNumber: sn.serialNumber })),
        })),
      }

      const response = await fetch(`/api/parcels/${parcel.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      })

      if (response.ok) {
        toast.success('Parcel updated successfully!')
        onSuccess()
      } else {
        const errorData = await response.json()
        toast.error(
          `Failed to update parcel: ${errorData.error || 'Unknown error'}\n${errorData.details || ''}`,
        )
      }
    } catch (error) {
      console.error('Error updating parcel:', error)
      toast.error('Failed to update parcel. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        serialNumbers: [{ id: Date.now().toString() + '-1', serialNumber: '' }],
      },
    ])
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const updateItemDescription = (itemId: string, description: string) => {
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, description } : item))
    setItems(updatedItems)
    setValue('items', updatedItems)
  }

  const addSerialNumber = (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            serialNumbers: [...item.serialNumbers, { id: Date.now().toString(), serialNumber: '' }],
          }
        : item,
    )
    setItems(updatedItems)
    setValue('items', updatedItems)
  }

  const removeSerialNumber = (itemId: string, serialId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            serialNumbers: item.serialNumbers.filter((sn) => sn.id !== serialId),
          }
        : item,
    )
    setItems(updatedItems)
    setValue('items', updatedItems)
  }

  const updateSerialNumber = (itemId: string, serialId: string, serialNumber: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            serialNumbers: item.serialNumbers.map((sn) =>
              sn.id === serialId ? { ...sn, serialNumber } : sn,
            ),
          }
        : item,
    )
    setItems(updatedItems)
    setValue('items', updatedItems)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From (Sender) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            From (Sender) <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('from')}
            placeholder="Sender name or company"
            className={errors.from ? 'border-red-500' : ''}
          />
          {errors.from && <p className="text-sm text-red-500">{errors.from.message}</p>}
        </div>

        {/* Sender Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Sender Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={senderTypeValue}
            onValueChange={(value) => setValue('senderType', value as ParcelFormData['senderType'])}
          >
            <SelectTrigger className={errors.senderType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incoming">Incoming</SelectItem>
              <SelectItem value="outgoing">Outgoing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.senderType && <p className="text-sm text-red-500">{errors.senderType.message}</p>}
        </div>

        {/* To (Recipient) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            To (Recipient) <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('to')}
            placeholder="Recipient name"
            className={errors.to ? 'border-red-500' : ''}
          />
          {errors.to && <p className="text-sm text-red-500">{errors.to.message}</p>}
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Weight</label>
          <Input {...register('weight')} placeholder="e.g., 2.5 kg" />
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Dimensions</label>
          <Input {...register('dimensions')} placeholder="e.g., 30x20x15 cm" />
        </div>
      </div>

      {/* Items with Multiple Serial Numbers */}
      <div className="space-y-4">
        <label className="text-sm font-medium">Items</label>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 border rounded-md space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <label className="text-xs font-medium mb-1 block">Item Description</label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItemDescription(item.id, e.target.value)}
                    placeholder="e.g., Samsung Galaxy S23"
                    className="w-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium">Serial Numbers</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addSerialNumber(item.id)}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Serial
                  </Button>
                </div>

                <div className="space-y-2">
                  {item.serialNumbers.map((serial) => (
                    <div key={serial.id} className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={serial.serialNumber}
                        onChange={(e) => updateSerialNumber(item.id, serial.id, e.target.value)}
                        placeholder="Serial number"
                        className="flex-1"
                      />
                      {item.serialNumbers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSerialNumber(item.id, serial.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addItem} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          {...register('notes')}
          placeholder="Additional notes, special instructions..."
          rows={2}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? 'Updating...' : 'Update Parcel'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset()
            onCancel()
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
