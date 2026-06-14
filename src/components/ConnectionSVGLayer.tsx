import React, { memo } from 'react';
import classNames from 'classnames';
import { useGameStore } from '../store/gameStore';
import type { PortType } from '../types';
import { portTypeToMask } from '../types';
import { GRID_SIZE } from '../config/constants';
import { Z_INDEX, connZ } from '../config/zIndex';
import { pathToPoints } from '../utils/portPosition';

interface ConnectionSVGLayerProps {
  /** 仅渲染该类型的连线，不传则渲染全部 */
  portType?: PortType;
}

/** 连线 SVG 渲染层：已确认连线 + 预览。按高度分多层渲染。 */
export const ConnectionSVGLayer: React.FC<ConnectionSVGLayerProps> = memo(({ portType: filterType }) => {
  const gridWidth = useGameStore(s => s.gridWidth);
  const gridHeight = useGameStore(s => s.gridHeight);
  const connections = useGameStore(s => s.connections);
  const selectedConnectionIds = useGameStore(s => s.selectedConnectionIds);
  const isConnecting = useGameStore(s => s.isConnecting);
  const previewPath = useGameStore(s => s.previewPath);
  const isValidPath = useGameStore(s => s.isValidPath);
  const tailFacingForPreview = useGameStore(s => s.activeTailFacing);
  const headFacingForPreview = useGameStore(s => s.previewHeadFacing);
  const connectPortType = useGameStore(s => s.portType);

  const svgSize = {
    width: gridWidth * GRID_SIZE,
    height: gridHeight * GRID_SIZE,
  };

  const zIndex = filterType ? connZ(Z_INDEX.STATIC_BASE, portTypeToMask[filterType]) : Z_INDEX.STATIC_BASE;

  const filteredConns = filterType
    ? connections.filter(c => c.portType === filterType)
    : connections;

  const showPreview = isConnecting && (!filterType || connectPortType === filterType);

  return (
    <svg
      className="connections-layer"
      style={{ ...svgSize, pointerEvents: 'none', zIndex }}
    >
      {filteredConns.map(conn => {
        const pts = pathToPoints(conn.path, conn.tailFacing, conn.headFacing);
        const cls = (base: string) => classNames(base, { selected: selectedConnectionIds.includes(conn.id) });
        const linePrefix = conn.portType === 'Liquid' ? 'pipe' : 'conveyor';

        return (
          <g key={conn.id}>
            <polyline points={pts} className={cls(`${linePrefix}-line-outline`)} />
            <polyline points={pts} className={cls(`${linePrefix}-line-fill`)} />
          </g>
        );
      })}

      {/* 连线预览 */}
      {showPreview && previewPath.length > 0 && (() => {
        const pt = pathToPoints(previewPath, tailFacingForPreview, headFacingForPreview);
        const pcls = (base: string) => classNames(base, { 'invalid': !isValidPath });
        const prevPrefix = connectPortType === 'Liquid' ? 'pipe' : 'conveyor';
        return (
          <>
            <polyline points={pt} className={pcls(`${prevPrefix}-preview-outline`)} />
            <polyline points={pt} className={pcls(`${prevPrefix}-preview-fill`)} />
          </>
        );
      })()}
    </svg>
  );
});
