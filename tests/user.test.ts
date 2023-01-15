import { v4 as uuidv4 } from 'uuid';
import supertest from 'supertest';
import { createServer } from 'http';
import { Request } from '../src/router/request';
import { Response } from '../src/router/response';
import { userRouter } from '../src/router/userRouter';
import { UserDto } from '../src/entities/user/userDto';
import { HttpStatusCodes } from '../src/constants/http';
import { userStore } from '../src/store/userStore';

const request = supertest(createServer(
  { IncomingMessage: Request, ServerResponse: Response },
  userRouter.actionHandler,
));

afterEach(() => {
  // tests should be independent of each other, so it is necessary to clean up storage between tests
  userStore.clearStore();
});

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should_return_empty_array_on_no_data_in_store', async () => {
      const response = await request.get('/api/users');

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it('should_return_collection_of_users', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const { body: createdUserResponseBody } = await request.post('/api/users').send(createUserRequest);

      const response = await request.get('/api/users');

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.body).toEqual([
        createdUserResponseBody,
      ]);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should_return_user_by_id', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const { body: createdUserResponseBody } = await request.post('/api/users').send(createUserRequest);

      const response = await request.get(`/api/users/${createdUserResponseBody.id}`);

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.body).toEqual(createdUserResponseBody);
    });

    it('should_throw_an_error_on_invalid_uuid', async () => {
      const response = await request.get('/api/users/someInvalidUuid');

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Invalid uuid.',
      });
    });

    it('should_throw_an_error_on_no_existent_user', async () => {
      const mockId = uuidv4();

      const response = await request.get(`/api/users/${mockId}`);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        message: 'User not found.',
      });
    });
  });

  describe('POST /api/users', () => {
    it('creates_user_in_store_should_return_created_user_in_response', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const response = await request.post('/api/users').send(createUserRequest);

      const userInStore = userStore.getUserById(response.body.id);

      expect(response.status).toBe(HttpStatusCodes.CREATED);
      expect(response.body).toEqual(userInStore);
    });

    it('should_throw_an_error_on_missing_required_fields', async () => {
      const invalidUserRequest = {
        username: 'username',
      };

      const response = await request.post('/api/users').send(invalidUserRequest);

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'age, hobbies are required',
      });
    });

    it('should_trow_an_error_on_bad_types_in_fields', async () => {
      const invalidUserRequest = {
        username: 12,
        age: '11',
        hobbies: 'hobbies',
      };

      const response = await request.post('/api/users').send(invalidUserRequest);

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        violations: [
          'Property username must be of type string.',
          'Property age must be of type number.',
          'Property hobbies must be of type array.',
        ],
      });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should_return_updated_user_with_appropriate_id', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const updateUserRequest: UserDto = {
        username: 'updatedUsername',
        age: 10,
        hobbies: [],
      };

      const { body: createdUserResponseBody } = await request.post('/api/users').send(createUserRequest);

      const putResponse = await request.put(`/api/users/${createdUserResponseBody.id}`).send(updateUserRequest);

      expect(putResponse.status).toBe(HttpStatusCodes.OK);
      expect(putResponse.body).toEqual({
        id: createdUserResponseBody.id,
        ...updateUserRequest,
      });
    });

    it('should_throw_an_error_on_invalid_uuid', async () => {
      const response = await request.put('/api/users/someInvalidUuid');

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Invalid uuid.',
      });
    });

    it('should_throw_an_error_on_no_existent_user', async () => {
      const mockId = uuidv4();

      const response = await request.put(`/api/users/${mockId}`);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        message: 'User not found.',
      });
    });

    it('should_trow_an_error_on_bad_types_in_fields', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const invalidUserRequest = {
        username: 12,
        age: '11',
        hobbies: 'hobbies',
      };

      const { body: createdUserResponseBody } = await request.post('/api/users').send(createUserRequest);

      const response = await request.put(`/api/users/${createdUserResponseBody.id}`).send(invalidUserRequest);

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        violations: [
          'Property username must be of type string.',
          'Property age must be of type number.',
          'Property hobbies must be of type array.',
        ],
      });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should_delete_user_from_store_and_returns_204_status', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const { body: createdUserResponseBody } = await request.post('/api/users').send(createUserRequest);

      const deleteResponse = await request.delete(`/api/users/${createdUserResponseBody.id}`);

      expect(deleteResponse.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it('should_throw_an_error_on_invalid_uuid', async () => {
      const response = await request.delete('/api/users/someInvalidUuid');

      expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Invalid uuid.',
      });
    });

    it('should_throw_an_error_on_no_existent_user', async () => {
      const mockId = uuidv4();

      const response = await request.put(`/api/users/${mockId}`);

      expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(response.body).toEqual({
        message: 'User not found.',
      });
    });
  });
});
