package main

import (
	"context"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx       context.Context
	count     int
	ticker    *time.Ticker
	done      chan bool
	isRunning bool
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		count:     0,
		done:      make(chan bool),
		isRunning: false,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Start begins the counter timer
func (a *App) Start() bool {
	if a.isRunning {
		return true
	}

	a.isRunning = true
	a.ticker = time.NewTicker(1 * time.Second)

	go func() {
		for {
			select {
			case <-a.done:
				return
			case <-a.ticker.C:
				a.count++
				// Emit the current count to frontend
				runtime.EventsEmit(a.ctx, "count-updated", a.count)
			}
		}
	}()

	return true
}

// Stop stops the counter timer
func (a *App) Stop() bool {
	if !a.isRunning {
		return true
	}

	a.isRunning = false
	a.ticker.Stop()
	a.done <- true
	return true
}

// GetCount returns the current count
func (a *App) GetCount() int {
	return a.count
}

// IsRunning returns the timer status
func (a *App) IsRunning() bool {
	return a.isRunning
}

// Increment increases the count by 1
func (a *App) Increment() int {
	a.count++
	return a.count
}

// Decrement decreases the count by 1
func (a *App) Decrement() int {
	a.count--
	return a.count
}
