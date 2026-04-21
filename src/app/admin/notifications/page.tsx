'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bell, Send, Users, MessageSquare, Mail } from 'lucide-react'

export default function NotificationsPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    channel: 'all',
    recipient: '',
    subject: '',
    message: ''
  })

  const sendNotification = async () => {
    if (!form.message.trim()) return
    
    setSending(true)
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId: 'demo',
          type: 'manual',
          ...form
        })
      })
      setSent(true)
      setForm({ channel: 'all', recipient: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Notificaciones Manuales</h1>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Enviar Notificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">Canal</label>
              <select 
                value={form.channel}
                onChange={(e) => setForm({...form, channel: e.target.value})}
                className="w-full mt-1 h-10 rounded-md bg-slate-700 border-slate-600 px-3"
              >
                <option value="all">📢 Todos los padres</option>
                <option value="telegram">✈️ Telegram</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="email">📧 Email</option>
              </select>
            </div>

            {form.channel !== 'all' && (
              <div>
                <label className="text-sm text-slate-400">Destinatario (opcional)</label>
                <Input
                  placeholder={form.channel === 'email' ? 'email@ejemplo.com' : '+58 412 1234567'}
                  value={form.recipient}
                  onChange={(e) => setForm({...form, recipient: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-slate-400">Asunto (solo email)</label>
              <Input
                placeholder="Asunto del mensaje..."
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Mensaje</label>
              <textarea
                placeholder="Escribe tu mensaje..."
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full mt-1 h-32 rounded-md bg-slate-700 border-slate-600 px-3 py-2"
              />
            </div>

            <Button 
              onClick={sendNotification} 
              disabled={sending || !form.message.trim()}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              {sending ? 'Enviando...' : sent ? '✓ Enviado' : '📤 Enviar Notificación'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Notificaciones Predefinidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => setForm({...form, message: '📢 RECORDATORIO: Reunión de padres mañana a las 8:00 AM en la sede principal.')}}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Recordatorio de Reunión
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => setForm({...form, message: '📢 Se informa que mañana habráasueto escolar por motivo de...')}
            }
            >
              <Bell className="h-4 w-4 mr-2" />
              Aviso de Asueto
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => setForm({...form, message: '📢 Recordatorio: El pago de mensualidad vence el próximo viernes.')}}
            >
              <Users className="h-4 w-4 mr-2" />
              Recordatorio de Pago
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}