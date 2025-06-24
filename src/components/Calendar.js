
/*import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './Calendar.css';
import staticEvents from '../events.json';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


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

  const today = dayjs();
  const startDay = date.startOf('month').day();
  const daysInMonth = date.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(dayjs(new Date(date.year(), date.month(), i)));
  }

  useEffect(() => {
    setEvents(staticEvents); // Load static events from JSON
  }, []);

  const getEvents = (d) =>
    events.filter((e) => dayjs(e.date).isSame(d, 'day'));

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...events];
      updated[editingIndex] = formData;
      setEvents(updated);
      setEditingIndex(null);
    } else {
      setEvents([...events, formData]);
    }
    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      duration: ''
    });
  };

  const handleEdit = (event, index) => {
    setFormData(event);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    setEvents(updated);
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
      <div className="calendar-header">
        <button onClick={() => setDate(date.subtract(1, 'month'))}>Prev</button>
<DatePicker
  selected={date.toDate()}
  onChange={(selectedDate) => setDate(dayjs(selectedDate))}
  dateFormat="MMMM yyyy"
  showMonthYearPicker
  showPopperArrow={false}
  className="month-picker"
/>
        <button onClick={() => setDate(date.add(1, 'month'))}>Next</button>
      </div>

      <form className="event-form" onSubmit={handleAddOrUpdateEvent}>
        <input type="text" placeholder="Title" value={formData.title} required
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input type="date" value={formData.date} required
          onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        <input type="time" value={formData.startTime} required
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
        <input type="time" value={formData.endTime} required
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
        <input type="text" placeholder="Duration" value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
        <button type="submit">{editingIndex !== null ? 'Update' : 'Add'} Event</button>
      </form>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}

        {days.map((d, idx) => (
          <div
            key={idx}
            className={`day-box ${d && d.isSame(today, 'day') ? 'today' : ''} ${selectedDate && d && d.isSame(selectedDate, 'day') ? 'selected' : ''}`}
            onClick={() => d && setSelectedDate(d)}
          >
            {d && (
              <>
                <div><strong>{d.date()}</strong></div>
                {getEvents(d).map((event, i) => {
                  const start = dayjs(`${event.date}T${event.startTime}`).format('hh:mm A');
                  const end = dayjs(`${event.date}T${event.endTime}`).format('hh:mm A');
                  const timeRange = `${start} – ${end} IST`;

                  return (
                    <div key={i} className="event">
                      <strong>{timeRange}</strong><br />
                      {event.title}<br />
                      {event.duration}
                      <div className="event-buttons">
                        <button type="button" onClick={() => handleEdit(event, getEventIndex(event))}>Edit</button>
                        <button type="button" onClick={() => handleDelete(getEventIndex(event))}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
*/
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';
import staticEvents from '../events.json';

const FESTIVALS = [
  { title: "New Year's Day", month: 0, day: 1 },
  { title: "Pongal", month: 0, day: 14 },
  { title: "Republic Day", month: 0, day: 26 },
  { title: "Holi", month: 2, day: 8 },
  { title: "Tamil New Year", month: 3, day: 14 },
  { title: "Independence Day", month: 7, day: 15 },
  { title: "Raksha Bandhan", month: 7, day: 19 },
  { title: "Ganesh Chaturthi", month: 8, day: 7 },
  { title: "Gandhi Jayanti", month: 9, day: 2 },
  { title: "Diwali", month: 10, day: 31 },
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

  const today = dayjs();
  const startDay = date.startOf('month').day();
  const daysInMonth = date.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(dayjs(new Date(date.year(), date.month(), i)));
  }

  // ✅ Merge events.json + saved local events
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const merged = [...staticEvents, ...stored];

    const unique = merged.filter(
      (event, index, self) =>
        index ===
        self.findIndex(
          (e) =>
            e.title === event.title &&
            e.date === event.date &&
            e.startTime === event.startTime &&
            e.endTime === event.endTime &&
            e.duration === event.duration
        )
    );

    setEvents(unique);
  }, []);

  const getEvents = (d) =>
    events.filter((e) => dayjs(e.date).isSame(d, 'day'));

  const getFestivalEvents = (d) =>
    FESTIVALS.filter(f => d.month() === f.month && d.date() === f.day)
      .map(f => ({ title: f.title, type: 'festival' }));

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    let updated;
    if (editingIndex !== null) {
      updated = [...events];
      updated[editingIndex] = formData;
      setEditingIndex(null);
    } else {
      updated = [...events, formData];
    }

    // Only store user-created events (exclude hardcoded ones)
    const userEvents = updated.filter(ev => !('type' in ev));
    setEvents(updated);
    localStorage.setItem('calendarEvents', JSON.stringify(userEvents));

    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      duration: ''
    });
  };

  const handleEdit = (event, index) => {
    setFormData(event);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    const userEvents = updated.filter(ev => !('type' in ev));
    setEvents(updated);
    localStorage.setItem('calendarEvents', JSON.stringify(userEvents));
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
      <div className="calendar-header">
        <button onClick={() => setDate(date.subtract(1, 'month'))}>Prev</button>

        {date.isValid() && (
          <DatePicker
            selected={date.toDate()}
            onChange={(selectedDate) => {
              if (selectedDate) {
                setDate(dayjs(selectedDate));
              } else {
                setDate(dayjs());
              }
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            showPopperArrow={false}
            className="month-picker"
            placeholderText="Select Month & Year"
          />
        )}

        <button onClick={() => setDate(date.add(1, 'month'))}>Next</button>
      </div>

      <form className="event-form" onSubmit={handleAddOrUpdateEvent}>
        <input type="text" placeholder="Title" value={formData.title} required
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input type="date" value={formData.date} required
          onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        <input type="time" value={formData.startTime} required
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
        <input type="time" value={formData.endTime} required
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
        <input type="text" placeholder="Duration" value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
        <button type="submit">{editingIndex !== null ? 'Update' : 'Add'} Event</button>
      </form>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}

        {days.map((d, idx) => (
          <div
            key={idx}
            className={`day-box ${d && d.isSame(today, 'day') ? 'today' : ''} ${selectedDate && d && d.isSame(selectedDate, 'day') ? 'selected' : ''}`}
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
                            <button type="button" onClick={() => handleEdit(event, getEventIndex(event))}>Edit</button>
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
    </div>
  );
};

export default Calendar;
