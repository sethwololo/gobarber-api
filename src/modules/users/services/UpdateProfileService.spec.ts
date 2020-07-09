import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile data', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Does',
      email: 'johndoes@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: `John Doesn't`,
      email: 'johndoesnt@example.com',
    });

    expect(updatedUser.name).toBe(`John Doesn't`);
    expect(updatedUser.email).toBe(`johndoesnt@example.com`);
  });

  it('should not be able to show a profile that does not exist', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existent user id',
        name: 'Non-existing User',
        email: 'nonexistinguser@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change email to an already used by another user', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: `Test`,
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Does',
      email: 'johndoes@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: `John Doesn't`,
      email: 'johndoesnt@example.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without informing the old one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Does',
      email: 'johndoes@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: `John Doesn't`,
        email: 'johndoesnt@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password if the old password is wrong', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Does',
      email: 'johndoes@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: `John Doesn't`,
        email: 'johndoesnt@example.com',
        old_password: 'wrong-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
