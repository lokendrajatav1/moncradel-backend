const mongoose = require('mongoose');
require('dotenv').config();

const Appointment = require('./src/modules/appointment/appointment.model');
const User = require('./src/modules/user/user.model');
const Baby = require('./src/modules/baby/baby.model');

const seedAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Clear existing appointments
    await Appointment.deleteMany({});
    console.log('Cleared existing appointments.');

    const parents = await User.find({ role: 'parent' });
    const doctors = await User.find({ role: 'doctor' });
    const babies = await Baby.find({});

    if (parents.length === 0 || doctors.length === 0 || babies.length === 0) {
      console.log('Missing dependencies. Please ensure you have at least one parent, doctor, and baby in the DB.');
      process.exit(1);
    }

    const statuses = ['scheduled', 'completed', 'cancelled'];
    const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    const appointmentsToCreate = [];
    
    // Creating 150 appointments to make sure pagination spans multiple pages
    for (let i = 0; i < 150; i++) {
      const parent = parents[i % parents.length];
      const doctor = doctors[i % doctors.length];
      
      // Try to find a baby belonging to this parent, otherwise fallback to any baby
      const parentBaby = babies.find(b => b.parentId.toString() === parent._id.toString());
      const baby = parentBaby || babies[i % babies.length];

      const status = statuses[i % statuses.length];
      const date = new Date();
      // Mix of past and future dates
      date.setDate(date.getDate() + (Math.floor(Math.random() * 30) - 15));

      appointmentsToCreate.push({
        parentId: parent._id,
        doctorId: doctor._id,
        babyId: baby._id,
        date: date.toISOString().split('T')[0],
        time: timeSlots[i % timeSlots.length],
        status: status,
        notes: `Routine checkup #${i + 1}`,
        meetingLink: status === 'scheduled' ? `https://meet.google.com/abc-${i}-def` : undefined,
        cancellationReason: status === 'cancelled' ? 'Parent requested reschedule.' : undefined,
      });
    }

    await Appointment.insertMany(appointmentsToCreate);
    console.log(`Successfully seeded ${appointmentsToCreate.length} appointments!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding appointments:', error);
    process.exit(1);
  }
};

seedAppointments();
