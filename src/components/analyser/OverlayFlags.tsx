'use client';

import Brand from '@/components/brand/Brand';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';

interface OverlayHit {
  layerId: number;
  layerName: string;
  bucket: string;
  attributes: Record<string, unknown>;
}

interface OverlayFlagsProps {
  overlays: OverlayHit[];
  zoneName: string | null;
}

interface Flag {
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
}

function getOverlayFlags(overlays: OverlayHit[]): Flag[] {
  const flags: Flag[] = [];

  for (const overlay of overlays) {
    switch (overlay.bucket) {
      case 'flood':
        flags.push({
          severity: 'critical',
          title: overlay.layerName,
          description: 'This site intersects with the flood overlay. Development may require hydraulic assessment, flood-resilient design, and minimum floor levels above the defined flood level.',
        });
        break;
      case 'bushfire':
        flags.push({
          severity: 'critical',
          title: overlay.layerName,
          description: 'Bushfire hazard area. Development must comply with BAL (Bushfire Attack Level) requirements and may require a bushfire management plan.',
        });
        break;
      case 'height': {
        const heightMetres = overlay.attributes?.HeightRestrictionMetres as number | undefined;
        const heightLabel = overlay.attributes?.LABEL as string | undefined;
        const heightDisplay = heightMetres ? `${heightMetres} metres` : heightLabel || null;
        flags.push({
          severity: 'warning',
          title: heightDisplay ? `Maximum building height: ${heightDisplay}` : overlay.layerName,
          description: `Building height is restricted by the planning scheme overlay.${heightDisplay ? ` Maximum permitted height is ${heightDisplay}.` : ''} Structures exceeding this limit are unlikely to be approved.`,
        });
        break;
      }
      case 'heritage':
      case 'character':
        flags.push({
          severity: 'warning',
          title: overlay.layerName,
          description: 'Heritage or character overlay applies. Development must demonstrate sensitivity to the heritage/character values of the area, which may affect building form, materials, and setbacks.',
        });
        break;
      case 'landslide':
        flags.push({
          severity: 'critical',
          title: overlay.layerName,
          description: 'Landslide hazard area. Geotechnical investigation is likely required. Development may be restricted or require specific engineering solutions.',
        });
        break;
      case 'slope':
        flags.push({
          severity: 'warning',
          title: overlay.layerName,
          description: 'Steep land overlay. Site works and earthmoving costs may be significantly higher. Retaining walls and specialised foundations may be required.',
        });
        break;
      case 'coastal':
        flags.push({
          severity: 'warning',
          title: overlay.layerName,
          description: 'Coastal protection area. Development must address coastal hazard risks including erosion, storm surge, and sea level rise.',
        });
        break;
      case 'waterways':
      case 'wetlands':
        flags.push({
          severity: 'warning',
          title: overlay.layerName,
          description: 'Waterway or wetland buffer applies. Setbacks from the waterway/wetland are required, which may reduce the developable area of the site.',
        });
        break;
      case 'biodiversity':
        flags.push({
          severity: 'warning',
          title: overlay.layerName,
          description: 'Native vegetation area. Vegetation clearing may be restricted or require offsets. Ecological assessment is likely required.',
        });
        break;
      case 'infrastructure':
        flags.push({
          severity: 'info',
          title: overlay.layerName,
          description: 'Infrastructure easement or buffer applies. Building setbacks from the infrastructure corridor are required.',
        });
        break;
      case 'environment':
        flags.push({
          severity: 'info',
          title: overlay.layerName,
          description: 'Environmental overlay applies. Additional assessment may be required depending on the nature of the development.',
        });
        break;
      default:
        flags.push({
          severity: 'info',
          title: overlay.layerName,
          description: 'Planning overlay identified. Review with a qualified planner recommended.',
        });
    }
  }

  return flags;
}

export default function OverlayFlags({ overlays, zoneName }: OverlayFlagsProps) {
  const flags = getOverlayFlags(overlays);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-text-primary">
        Site Constraints & Overlays
        <span className="ml-2 text-[10px] font-normal text-text-tertiary">
          ({overlays.length} detected)
        </span>
      </h3>

      {overlays.length === 0 && zoneName && (
        <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-800">No major overlays detected</p>
            <p className="text-xs text-emerald-600 mt-1">
              This site does not appear to be affected by major planning overlays based on available data. A formal assessment is still recommended to confirm.
            </p>
          </div>
        </div>
      )}

      {flags.map((flag, i) => {
        const Icon = flag.severity === 'critical' ? ShieldAlert : flag.severity === 'warning' ? AlertTriangle : Info;
        const bgColor = flag.severity === 'critical' ? 'bg-red-50 border-red-200' : flag.severity === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200';
        const iconColor = flag.severity === 'critical' ? 'text-red-500' : flag.severity === 'warning' ? 'text-amber-500' : 'text-blue-500';
        const titleColor = flag.severity === 'critical' ? 'text-red-800' : flag.severity === 'warning' ? 'text-amber-800' : 'text-blue-800';
        const textColor = flag.severity === 'critical' ? 'text-red-600' : flag.severity === 'warning' ? 'text-amber-600' : 'text-blue-600';

        return (
          <div key={i} className={`flex items-start gap-2.5 p-3 border rounded-xl ${bgColor}`}>
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div>
              <p className={`text-sm font-medium ${titleColor}`}>{flag.title}</p>
              <p className={`text-xs mt-1 leading-relaxed ${textColor}`}>{flag.description}</p>
            </div>
          </div>
        );
      })}

      {/* Disclaimer */}
      <div className="pt-3 border-t border-border/50">
        <p className="text-[10px] text-text-tertiary leading-relaxed">
          This assessment is indicative only, based on publicly available planning scheme data current
          as at {new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}.
          It does not constitute professional planning advice. Site-specific conditions, local plan
          provisions, and recent amendments may affect development potential. We recommend engaging
          <Brand>Casa Intelligence</Brand> for a formal feasibility assessment.
        </p>
      </div>
    </div>
  );
}
