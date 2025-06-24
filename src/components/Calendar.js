import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import staticEvents from '../events.json';

const FESTIVALS = [
  { title: "New Year's Day", month: 0, day: 1 },
  { title: "Pongal", month: 0, day: 14 },
  { title: "Republic Day", month: 0, day: 26 },
  { title: "Mahashivratri", month: 1, day: 29 },
  { title: "Holi", month: 2, day: 8 },
  { title: "Ugadi / Gudi Padwa", month: 2, day: 30 },
  { title: "Tamil New Year", month: 3, day: 14 },
  { title: "Good Friday", month: 2, day: 29 },
  { title: "May Day (Labour Day)", month: 4, day: 1 },
  { title: "Ramzan / Eid-ul-Fitr", month: 4, day: 2 },
  { title: "Bakrid / Eid al-Adha", month: 5, day: 17 },
  { title: "Independence Day", month: 7, day: 15 },
  { title: "Raksha Bandhan", month: 7, day: 19 },
  { title: "Krishna Janmashtami", month: 7, day: 26 },
  { title: "Ganesh Chaturthi", month: 8, day: 7 },
  { title: "Gandhi Jayanti", month: 9, day: 2 },
  { title: "Ayudha Pooja", month: 9, day: 11 },
  { title: "Vijayadashami (Dussehra)", month: 9, day: 12 },
  { title: "Milad-un-Nabi", month: 9, day: 15 },
  { title: "Diwali / Deepavali", month: 10, day: 31 },
  { title: "Children's Day", month: 10, day: 14 },
  { title: "Guru Nanak Jayanti", month: 10, day: 28 },
  { title: "Christmas", month: 11, day: 25 }
];

const Calendar = () => {
  const [date, setDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const formRef = useRef(null);

  const today = dayjs();
  const startDay = date.startOf('month').day();
  const daysInMonth = date.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(dayjs(new Date(date.year(), date.month(), i)));
  }

  useEffect(() => {
    const saved = localStorage.getItem('calendarEvents');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (err) {
        console.error("Invalid localStorage data. Resetting...");
        setEvents(staticEvents);
        localStorage.setItem('calendarEvents', JSON.stringify(staticEvents));
      }
    } else {
      setEvents(staticEvents);
      localStorage.setItem('calendarEvents', JSON.stringify(staticEvents));
    }
  }, []);

  const getEvents = (d) =>
    events.filter((e) => dayjs(e.date).isSame(d, 'day'));

  const getFestivalEvents = (d) => {
    if (!d) return [];
    return FESTIVALS.filter(f => d.month() === f.month && d.date() === f.day)
      .map(f => ({ title: f.title, type: 'festival' }));
  };

  const getMonthlyUserEvents = () =>
    events
      .filter(event => {
        const eventDate = dayjs(event.date);
        return eventDate.month() === date.month() && eventDate.year() === date.year();
      })
      .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  const getMonthlyFestivals = () =>
    FESTIVALS.filter(f =>
      f.month === date.month() &&
      dayjs(`${date.year()}-${f.month + 1}-${f.day}`).isValid()
    ).map(f => ({
      title: f.title,
      date: dayjs(`${date.year()}-${f.month + 1}-${f.day}`)
    }));

  const calculateDuration = (start, end) => {
    const s = dayjs(`2000-01-01T${start}`);
    const e = dayjs(`2000-01-01T${end}`);
    if (!s.isValid() || !e.isValid()) return '';
    const diff = e.diff(s, 'minute');
    if (diff < 1) return 'Invalid';
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h ? `${h}h` : ''} ${m ? `${m}m` : ''}`.trim();
  };

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();

    const eventDate = dayjs(formData.date).startOf('day');
    const todayDate = dayjs().startOf('day');
    if (eventDate.isBefore(todayDate)) {
      alert("⚠️ Cannot add or edit events in the past.");
      return;
    }

    const updated = [...events];

    if (editingIndex !== null) {
      updated[editingIndex] = formData;
      setEditingIndex(null);
    } else {
      updated.push(formData);
    }

    setEvents(updated);
    localStorage.setItem('calendarEvents', JSON.stringify(updated));

    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      duration: ''
    });
  };

  const handleEdit = (event, index) => {
    const eventDate = dayjs(event.date).startOf('day');
    const todayDate = dayjs().startOf('day');
    if (eventDate.isBefore(todayDate)) {
      alert("⚠️ Cannot edit past events.");
      return;
    }

    setFormData(event);
    setEditingIndex(index);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    setEvents(updated);
    localStorage.setItem('calendarEvents', JSON.stringify(updated));
  };

  const getEventIndex = (event) =>
    events.findIndex(
      (e) =>
        e.title === event.title &&
        e.date === event.date &&
        e.startTime === event.startTime &&
        e.endTime === event.endTime &&
        e.duration === event.duration
    );

  return (
    <div className="calendar-container colorful">
      {/* 📅 Header */}
      <div className="calendar-header">
        <button onClick={() => setDate(date.subtract(1, 'month'))}>Prev</button>
        <DatePicker
          selected={date.toDate()}
          onChange={(selectedDate) => setDate(dayjs(selectedDate))}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          className="month-picker"
        />
        <button onClick={() => setDate(date.add(1, 'month'))}>Next</button>
      </div>

      {/* ✏️ Event Form */}
      <form ref={formRef} className="event-form" onSubmit={handleAddOrUpdateEvent}>
        <input type="text" placeholder="Title" value={formData.title} required
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input type="date" value={formData.date} required
          min={dayjs().format('YYYY-MM-DD')}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        <input type="time" placeholder="Start Time" value={formData.startTime} required
          onChange={(e) => {
            const start = e.target.value;
            const end = formData.endTime;
            const duration = start && end ? calculateDuration(start, end) : '';
            setFormData({ ...formData, startTime: start, duration });
          }} />
        <input type="time" placeholder="End Time" value={formData.endTime} required
          onChange={(e) => {
            const end = e.target.value;
            const start = formData.startTime;
            const duration = start && end ? calculateDuration(start, end) : '';
            setFormData({ ...formData, endTime: end, duration });
          }} />
        <input type="text" value={formData.duration} readOnly placeholder="Duration" />
        <button type="submit">{editingIndex !== null ? 'Update' : 'Add'} Event</button>
      </form>

      {/* 🗓️ Calendar Grid */}
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}

        {days.map((d, idx) => (
          <div
            key={idx}
            className={`day-box ${getFestivalEvents(d).length ? 'festival-day' : ''} ${d && d.isSame(today, 'day') ? 'today' : ''} ${selectedDate && d && d.isSame(selectedDate, 'day') ? 'selected' : ''}`}
            onClick={() => d && setSelectedDate(d)}
          >
            {d && (
              <>
                <div><strong>{d.date()}</strong></div>
                {[...getFestivalEvents(d), ...getEvents(d)].map((event, i) => {
                  const isFestival = event.type === 'festival';
                  const start = !isFestival && dayjs(`${event.date}T${event.startTime}`).format('hh:mm A');
                  const end = !isFestival && dayjs(`${event.date}T${event.endTime}`).format('hh:mm A');
                  const timeRange = !isFestival ? `${start} – ${end} IST` : null;

                  return (
                    <div
                      key={i}
                      className={`event ${isFestival ? 'festival' : ''}`}
                      style={{
                        backgroundColor: isFestival ? '#ffecec' : undefined,
                        borderLeft: isFestival ? '4px solid red' : undefined
                      }}
                    >
                      <strong>{isFestival ? '🎉 Festival' : timeRange}</strong><br />
                      {event.title}
                      {!isFestival && (
                        <>
                          <br />{event.duration}
                          <div className="event-buttons">
                            <button
                              type="button"
                              disabled={dayjs(event.date).isBefore(today, 'day')}
                              className={dayjs(event.date).isBefore(today, 'day') ? 'disabled-edit-btn' : ''}
                              onClick={() => handleEdit(event, getEventIndex(event))}>
                              Edit
                            </button>
                            <button type="button" onClick={() => handleDelete(getEventIndex(event))}>Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ))}
      </div>

      {/* 🔽 Bottom Summary */}
      <div className="bottom-summary">
        <div className="monthly-events">
          <h3>📅 Events in {date.format('MMMM YYYY')}</h3>
          {getMonthlyUserEvents().map((event, i) => {
          const isPast = dayjs(event.date).isBefore(today, 'day');
           return (
            <li key={i} className="monthly-event-item">
            <strong>{dayjs(event.date).format('MMM D')}:</strong>{' '}
            {event.title} {isPast && <span style={{ color: 'gray', fontStyle: 'italic' }}>(Day Completed)</span>} —{' '}
            {dayjs(`${event.date}T${event.startTime}`).format('hh:mm A')} to{' '}
            {dayjs(`${event.date}T${event.endTime}`).format('hh:mm A')} ({event.duration})
        </li>
         );
        })}
        </div>
        <div className="monthly-festivals">
          <h3>🎉 Festivals in {date.format('MMMM YYYY')}</h3>
          {getMonthlyFestivals().length === 0 ? (
            <p>No festivals this month.</p>
          ) : (
            <ul>
              {getMonthlyFestivals().map((f, i) => (
                <li key={i}>
                  <strong>{f.date.format('MMM D')}:</strong> {f.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
