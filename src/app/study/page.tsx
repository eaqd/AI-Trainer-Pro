"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { conceptCards, rubricGuide, platformInfo, glossaryTerms } from "@/lib/study-content"
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/types"
import type { QuizCategory } from "@/types"
import {
  BookOpen, Star, Building2, FileText,
  ChevronDown, ChevronUp, Lightbulb, AlertTriangle, CheckCircle,
} from "lucide-react"

export default function StudyPage() {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)
  const [glossaryFilter, setGlossaryFilter] = useState<string>("")

  const glossaryCategories = Array.from(new Set(glossaryTerms.map(t => t.category)))
  const filteredTerms = glossaryFilter
    ? glossaryTerms.filter(t => t.category === glossaryFilter)
    : glossaryTerms

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8" /> Study Mode
        </h1>
        <p className="text-muted-foreground">
          Learn what evaluators look for and how to excel on AI training platforms
        </p>
      </div>

      <Tabs defaultValue="concepts">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="concepts" className="gap-1"><Lightbulb className="w-4 h-4" /> Concepts</TabsTrigger>
          <TabsTrigger value="rubrics" className="gap-1"><Star className="w-4 h-4" /> Rubrics</TabsTrigger>
          <TabsTrigger value="platforms" className="gap-1"><Building2 className="w-4 h-4" /> Platforms</TabsTrigger>
          <TabsTrigger value="glossary" className="gap-1"><FileText className="w-4 h-4" /> Glossary</TabsTrigger>
        </TabsList>

        {/* Concept Cards */}
        <TabsContent value="concepts">
          <div className="space-y-4 mt-4">
            {conceptCards.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{CATEGORY_ICONS[card.category as QuizCategory]}</span>
                    <div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription>
                        {CATEGORY_LABELS[card.category as QuizCategory]}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4 leading-relaxed">{card.content}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Key Points:</h4>
                    <ul className="space-y-1.5">
                      {card.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rubric Guide */}
        <TabsContent value="rubrics">
          <div className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Quality Rating Scale</CardTitle>
                <CardDescription>
                  This rubric is used across most AI training platforms. Learn what each score means.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {rubricGuide.map((level) => (
                  <div key={level.score} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        level.score === 5 ? 'bg-green-500' :
                        level.score === 4 ? 'bg-blue-500' :
                        level.score === 3 ? 'bg-yellow-500' :
                        level.score === 2 ? 'bg-orange-500' : 'bg-red-500'
                      }`}>
                        {level.score}
                      </div>
                      <div>
                        <h3 className="font-semibold">{level.label}</h3>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                    <div className="ml-13 pl-4 border-l-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Examples:</p>
                      <ul className="space-y-1">
                        {level.examples.map((ex, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {ex}</li>
                        ))}
                      </ul>
                    </div>
                    {level.score > 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platform Tips */}
        <TabsContent value="platforms">
          <div className="space-y-4 mt-4">
            {platformInfo.map((platform) => {
              const isExpanded = expandedPlatform === platform.name
              return (
                <Card key={platform.name}>
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setExpandedPlatform(isExpanded ? null : platform.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription>{platform.description.slice(0, 100)}...</CardDescription>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                    <Badge variant="secondary">{platform.payRange}</Badge>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent className="space-y-6">
                      <p className="text-sm leading-relaxed">{platform.description}</p>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Task Types:</h4>
                        <div className="flex flex-wrap gap-2">
                          {platform.taskTypes.map((task, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{task}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" /> Qualification Tips
                        </h4>
                        <ul className="space-y-1">
                          {platform.qualificationTips.map((tip, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" /> Common Mistakes
                        </h4>
                        <ul className="space-y-1">
                          {platform.commonMistakes.map((mistake, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-yellow-500 mt-1">•</span> {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-500" /> Pro Tips
                        </h4>
                        <ul className="space-y-1">
                          {platform.proTips.map((tip, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Glossary */}
        <TabsContent value="glossary">
          <div className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={glossaryFilter === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setGlossaryFilter("")}
              >
                All
              </Badge>
              {glossaryCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant={glossaryFilter === cat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setGlossaryFilter(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              {filteredTerms.map((term) => (
                <Card key={term.term}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-sm">{term.term}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{term.definition}</p>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">{term.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
