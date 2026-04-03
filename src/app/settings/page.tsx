"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectOption } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CATEGORY_LABELS } from "@/types"
import type { QuizCategory } from "@/types"
import { useTheme } from "next-themes"
import { Settings, Save, Loader2, Check } from "lucide-react"

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as QuizCategory[]

interface SettingsData {
  darkMode: boolean
  difficulty: string
  dailyGoal: number
  focusCategories: string[]
  apiKey: string | null
  timeGoal: number
}

export default function SettingsPage() {
  const { setTheme } = useTheme()
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState("")

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then((data) => {
        setSettings(data)
        if (data.darkMode) setTheme('dark')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [setTheme])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      const body: Record<string, unknown> = { ...settings }
      if (apiKeyInput) body.apiKey = apiKeyInput
      delete body.apiKey
      if (apiKeyInput.trim()) body.apiKey = apiKeyInput.trim()

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
    setSaving(false)
  }

  const toggleCategory = (cat: QuizCategory) => {
    if (!settings) return
    const current = settings.focusCategories || []
    const updated = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat]
    setSettings({ ...settings, focusCategories: updated })
  }

  const toggleDarkMode = (checked: boolean) => {
    if (!settings) return
    setSettings({ ...settings, darkMode: checked })
    setTheme(checked ? 'dark' : 'light')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!settings) return <div className="p-6">Failed to load settings.</div>

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8" /> Settings
        </h1>
        <p className="text-muted-foreground">Customize your training experience</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
            </div>
            <Switch checked={settings.darkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Training Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <Select value={settings.difficulty} onValueChange={(v) => setSettings({ ...settings, difficulty: v })}>
              <SelectOption value="auto">Auto (based on performance)</SelectOption>
              <SelectOption value="beginner">Beginner</SelectOption>
              <SelectOption value="intermediate">Intermediate</SelectOption>
              <SelectOption value="advanced">Advanced</SelectOption>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Daily Question Goal</Label>
            <Input
              type="number"
              value={settings.dailyGoal}
              onChange={(e) => setSettings({ ...settings, dailyGoal: parseInt(e.target.value) || 10 })}
              min={5}
              max={100}
            />
          </div>

          <div className="space-y-2">
            <Label>Daily Time Goal (minutes)</Label>
            <Input
              type="number"
              value={settings.timeGoal}
              onChange={(e) => setSettings({ ...settings, timeGoal: parseInt(e.target.value) || 15 })}
              min={5}
              max={240}
            />
          </div>
        </CardContent>
      </Card>

      {/* Focus Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Focus Categories</CardTitle>
          <CardDescription>Select categories to prioritize in your training</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = settings.focusCategories?.includes(cat)
              return (
                <Badge
                  key={cat}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() => toggleCategory(cat)}
                >
                  {isSelected && <Check className="w-3 h-3 mr-1" />}
                  {CATEGORY_LABELS[cat]}
                </Badge>
              )
            })}
          </div>
          {(!settings.focusCategories || settings.focusCategories.length === 0) && (
            <p className="text-xs text-muted-foreground mt-2">All categories enabled by default</p>
          )}
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Claude API Key</CardTitle>
          <CardDescription>
            Required for AI-powered prompt evaluation feedback. Get your key from the Anthropic console.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              placeholder={settings.apiKey ? "••••••••" : "sk-ant-..."}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
            />
            {settings.apiKey && (
              <p className="text-xs text-green-600">API key is configured</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : saved ? (
          <Check className="w-4 h-4 mr-2" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        {saved ? 'Saved!' : 'Save Settings'}
      </Button>
    </div>
  )
}
