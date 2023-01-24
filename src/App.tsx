import { MouseEventHandler, useCallback, useEffect, useState } from 'react'
import './App.css'

type Coordinate = {
  x: number
  y: number
}

const Circle = ({ x, y }: Coordinate) => (
  <div className="circle" style={{ top: y, left: x }} />
)

const App = () => {
  const [items, setItems] = useState<Coordinate[]>([])
  const [visibleItems, setVisibleItems] = useState<Coordinate[]>([])
  const canUndo = !!visibleItems.length
  const canRedo = visibleItems.length !== items.length

  const addItem: MouseEventHandler<HTMLDivElement> = ({
    clientX: x,
    clientY: y,
  }) => {
    const newCoordinates = [...visibleItems, { x, y }]
    setVisibleItems(newCoordinates)
    setItems(newCoordinates)
  }

  const undo = useCallback(() => {
    if (canUndo) setVisibleItems(visibleItems.slice(0, -1))
  }, [canUndo, visibleItems])

  const redo = useCallback(() => {
    if (canRedo) setVisibleItems([...visibleItems, items[visibleItems.length]])
  }, [canRedo, items, visibleItems])

  const keyDownHandler = useCallback(
    ({ metaKey, altKey, key, shiftKey }: KeyboardEvent) => {
      if (!(metaKey || altKey) || key !== 'z') return

      const action = shiftKey ? redo : undo

      action()
    },
    [redo, undo]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler)
    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [keyDownHandler])

  return (
    <>
      <div className="circle-wrapper" onMouseDown={addItem}>
        {visibleItems.map(({ x, y }, i) => (
          <Circle x={x} y={y} key={`${x}-${y}-${i}`} />
        ))}
      </div>
      <div className="buttons-wrapper">
        <button onMouseDown={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onMouseDown={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
    </>
  )
}

export default App
