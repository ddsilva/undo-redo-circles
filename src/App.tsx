import './App.css'
import { MouseEventHandler, useCallback, useEffect, useState } from 'react'

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

  const addItem: MouseEventHandler<HTMLDivElement> = ({
    clientX: x,
    clientY: y,
  }) => {
    const newCoordinates = [...visibleItems, { x, y }]
    setVisibleItems(newCoordinates)
    setItems(newCoordinates)
  }

  const undo = useCallback(() => {
    if (!visibleItems.length) return
    setVisibleItems(visibleItems.slice(0, -1))
  }, [visibleItems])

  const redo = useCallback(() => {
    if (visibleItems.length === items.length) return
    setVisibleItems([...visibleItems, items[visibleItems.length]])
  }, [items, visibleItems])

  const keyDownHandler = useCallback(
    ({ metaKey, altKey, key, shiftKey }: KeyboardEvent) => {
      const shouldHandle = metaKey || altKey

      if (shouldHandle && key === 'z') {
        if (shiftKey) {
          redo()
        } else {
          undo()
        }
      }
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
        <button onMouseDown={undo}>Undo</button>
        <button onMouseDown={redo}>Redo</button>
      </div>
    </>
  )
}

export default App
