'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task, UrgencyLevel } from '@/lib/types'
import { getUrgency } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'deadlinedoctor_tasks'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTasks(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [])

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }, [])

  const addTask = useCallback((data: {
    title: string
    description?: string
    deadline: string
    type: string
  }) => {
    const task: Task = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      type: data.type,
      status: 'active',
      urgency: getUrgency(data.deadline),
      microTasks: [],
      createdAt: new Date().toISOString(),
    }
    persist([task, ...tasks])
    return task
  }, [tasks, persist])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, ...updates, urgency: getUrgency(updates.deadline || t.deadline) } : t
    )
    persist(updated)
  }, [tasks, persist])

  const deleteTask = useCallback((id: string) => {
    persist(tasks.filter(t => t.id !== id))
  }, [tasks, persist])

  const markDone = useCallback((id: string) => {
    updateTask(id, { status: 'done' })
  }, [updateTask])

  // Refresh urgency every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(t => ({ ...t, urgency: getUrgency(t.deadline) })))
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const activeTasks = tasks.filter(t => t.status !== 'done')
  const doneTasks = tasks.filter(t => t.status === 'done')
  const criticalTasks = activeTasks.filter(t => t.urgency === 'critical')

  return { tasks, activeTasks, doneTasks, criticalTasks, loaded, addTask, updateTask, deleteTask, markDone }
}
