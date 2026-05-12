import {
  faCalendarCheck,
  faCheck,
  faClock,
  faUsers,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '@mantine/core';

import classes from '../home-page.module.css';

interface ProductMenuItem {
  label: string;
  icon: IconDefinition;
  active?: boolean;
}

const productMenu: ProductMenuItem[] = [
  { label: 'Resumen', icon: faCheck, active: true },
  { label: 'Turnos', icon: faCalendarCheck },
  { label: 'Horarios', icon: faClock },
  { label: 'Equipo', icon: faUsers },
];

const appointmentRows = [
  { time: '09:00', client: 'Ana Lopez', status: 'Confirmado' },
  { time: '10:30', client: 'Luis Romero', status: 'Pendiente' },
  { time: '12:00', client: 'Mica Suarez', status: 'Reprogramado' },
];

// Colores explícitos para texto oscuro sobre superficie blanca del mock
const dark = 'var(--app-color-text-primary)';
const muted = 'var(--app-color-text-muted)';

export function HeroProductMock() {
  return (
    <div className={classes.mockFrame}>
      <div className={classes.mockWindowBar}>
        <span className={classes.mockWindowDot} />
        <span className={classes.mockWindowDot} />
        <span className={classes.mockWindowDot} />
      </div>

      <div className={classes.mockShell}>
        {/* Sidebar */}
        <div className={classes.mockSidebar}>
          <div className={classes.mockBrand}>BK</div>
          <div className={classes.mockMenu}>
            {productMenu.map((item) => (
              <div
                key={item.label}
                className={item.active ? classes.mockMenuItemActive : classes.mockMenuItem}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span style={{ color: item.active ? dark : muted }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={classes.mockContent}>
          {/* Toolbar */}
          <div className={classes.mockToolbar}>
            <div>
              <Text fw={700} size="sm" style={{ color: dark }}>
                Operacion del dia
              </Text>
              <Text size="xs" style={{ color: muted }}>
                Servicio activo y agenda ordenada.
              </Text>
            </div>
            <div className={classes.mockToolbarPill}>Hoy</div>
          </div>

          {/* KPIs */}
          <div className={classes.mockKpiGrid}>
            {[
              { label: 'Turnos', value: '18' },
              { label: 'Equipo', value: '4' },
              { label: 'Excepciones', value: '2' },
            ].map((kpi) => (
              <div key={kpi.label} className={classes.mockKpiCard}>
                <Text size="xs" style={{ color: muted }}>
                  {kpi.label}
                </Text>
                <Text fw={800} size="xl" style={{ color: dark }}>
                  {kpi.value}
                </Text>
              </div>
            ))}
          </div>

          {/* Turnos del dia */}
          <div className={classes.mockPanel}>
            <div className={classes.mockPanelHeader}>
              <Text fw={700} size="sm" style={{ color: dark }}>
                Turnos del dia
              </Text>
              <div className={classes.mockTag}>Agenda activa</div>
            </div>

            <div className={classes.mockAppointments}>
              {appointmentRows.map((row) => (
                <div key={`${row.time}-${row.client}`} className={classes.mockAppointmentRow}>
                  <Text fw={700} size="sm" style={{ color: dark }}>
                    {row.time}
                  </Text>
                  <Text size="sm" className={classes.mockAppointmentClient} style={{ color: dark }}>
                    {row.client}
                  </Text>
                  <div className={classes.mockStatus}>{row.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom grid */}
          <div className={classes.mockBottomGrid}>
            <div className={classes.mockMiniCard}>
              <Text fw={700} size="sm" style={{ color: dark }}>
                Horarios
              </Text>
              <div className={classes.mockScheduleBars}>
                <span style={{ width: '84%' }} />
                <span style={{ width: '66%' }} />
                <span style={{ width: '74%' }} />
              </div>
            </div>
            <div className={classes.mockMiniCard}>
              <Text fw={700} size="sm" style={{ color: dark }}>
                Equipo
              </Text>
              <div className={classes.mockChips}>
                <span>Recepcion</span>
                <span>Asistencia</span>
                <span>Seguimiento</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
