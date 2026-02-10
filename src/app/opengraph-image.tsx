import { ImageResponse } from 'next/og';

export const alt = 'Casa Intelligence - Development Intelligence for the Sunshine Coast';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(160deg, #110D40 0%, #1B1464 40%, #2D2080 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* Logo mark as text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              color: 'white',
              fontWeight: 300,
            }}
          >
            C
          </div>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 300,
              color: 'white',
              letterSpacing: '0.02em',
            }}
          >
            Casa Intelligence
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 400,
            color: 'white',
            lineHeight: 1.15,
            marginBottom: '24px',
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Development Intelligence</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>for the Sunshine Coast</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.5,
            maxWidth: '600px',
          }}
        >
          Feasibility reports, planning analysis, and pre-development advisory.
          Powered by proprietary data intelligence.
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '100px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.15em',
          }}
        >
          CASAINTELLIGENCE.COM.AU
        </div>

        {/* Decorative accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 70%, transparent 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
