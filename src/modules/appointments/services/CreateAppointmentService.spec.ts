import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: 'idteste123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('idteste123');
  });

  // it('should not be able to create two appointments in the same hour', () => {
  //   expect(1 + 2).toBe(3);
  // });
});
