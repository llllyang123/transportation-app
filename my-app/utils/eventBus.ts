type EventHandler = (...args: any[]) => void

interface EventMap {
  [eventName: string]: EventHandler[]
}

class EventBus {
  private events: EventMap = {}

  // 注册事件监听
  on(eventName: string, handler: EventHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(handler)
    return () => this.off(eventName, handler) // 返回取消订阅函数
  }

  // 触发事件
  emit(eventName: string, ...args: any[]) {
    const handlers = this.events[eventName]
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  }

  // 取消事件监听
  off(eventName: string, handler: EventHandler) {
    const handlers = this.events[eventName]
    if (handlers) {
      this.events[eventName] = handlers.filter(h => h !== handler)
    }
  }
}

// 创建单例事件总线
export const eventBus = new EventBus()

// 定义订单刷新事件名称
export const ORDER_REFRESH_EVENT = 'orderRefresh'

// 快捷方法：触发订单刷新
export const emitOrderRefresh = () => {
  eventBus.emit(ORDER_REFRESH_EVENT)
}

// 快捷方法：监听订单刷新
export const onOrderRefresh = (callback: () => void) => {
  return eventBus.on(ORDER_REFRESH_EVENT, callback)
}
