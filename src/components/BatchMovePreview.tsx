import React, { memo } from 'react';
import { useGameStore } from '../store/gameStore';
import { Machine } from './Machine';
import { GameMode } from '../types';
import type { Point, Connection } from '../types';
import { pathToPoints } from '../utils/portPosition';
import { Z_INDEX } from '../config/zIndex';

interface BatchMovePreviewProps {
  hoverPos: Point | null;
}

/** MOVE_SELECTION / BLUEPRINT_PLACE 模式下的批量移动预览（机器虚影 + 连线虚影） */
export const BatchMovePreview: React.FC<BatchMovePreviewProps> = memo(({ hoverPos }) => {
  const mode = useGameStore(s => s.mode);
  const moveAnchor = useGameStore(s => s.moveAnchor);
  const movingMachinesSnapshot = useGameStore(s => s.movingMachinesSnapshot);
  const movingConnectionsSnapshot = useGameStore(s => s.movingConnectionsSnapshot);

  const show = (mode === GameMode.MOVE_SELECTION || mode === GameMode.BLUEPRINT_PLACE) && moveAnchor && hoverPos;
  if (!show) return null;

  const offsetX = hoverPos!.x - moveAnchor!.x;
  const offsetY = hoverPos!.y - moveAnchor!.y;

  return (
    <>
      {/* 机器虚影 */}
      {movingMachinesSnapshot.map(m => {
        const ghostX = m.x + offsetX;
        const ghostY = m.y + offsetY;

        return (
          <div key={`ghost-${m.id}`} style={{ opacity: 0.6, pointerEvents: 'none', zIndex: Z_INDEX.GHOST }}>
            <Machine
              data={{ ...m, x: ghostX, y: ghostY }}
              isSelected={true}
              isPowered={true}
            />
          </div>
        );
      })}

      {/* 连线虚影 SVG */}
      <svg
        className="connections-layer"
        style={{ pointerEvents: 'none', zIndex: Z_INDEX.BATCH_MOVE_CONNECTIONS }}
      >
        {movingConnectionsSnapshot.map((conn: Connection) => {
          const newPath = conn.path.map(p => ({ x: p.x + offsetX, y: p.y + offsetY }));
          const pointsStr = pathToPoints(newPath, conn.tailFacing, conn.headFacing);
          const linePrefix = conn.portType === 'Liquid' ? 'pipe' : 'conveyor';

          return (
            <React.Fragment key={`ghost-conn-${conn.id}`}>
              <polyline
                points={pointsStr}
                className={`${linePrefix}-line-outline`}
                style={{ opacity: 0.5 }}
              />
              <polyline
                points={pointsStr}
                className={`${linePrefix}-line-fill`}
                style={{ opacity: 0.5 }}
              />
            </React.Fragment>
          );
        })}
      </svg>
    </>
  );
});
