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
  describe('GET /users', () => {
    it('should_return_empty_array_on_no_data_in_store', async () => {
      const response = await request.get('/api/users');

      expect(response.status).toBe(HttpStatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    describe('GET /users/:id', () => {
      it('should_return_an_error_on_no_data_in_store', async () => {
        const mockId = uuidv4();

        const response = await request.get(`/api/users/${mockId}`);

        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(response.body).toEqual({
          message: 'User not found.',
        });
      });
    });
  });

  describe('POST /users', () => {
    it('creates_user_in_store_should_return_created_user_in_response', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const response = await request.post('/api/users').send(createUserRequest);

      const userInStore = userStore.getUserById(response.body.id);

      expect(response.status).toEqual(HttpStatusCodes.CREATED);
      expect(response.body).toEqual(userInStore);
    });
  });

  describe('GET /users/:id', () => {
    it('should_return_user_with_appropriate_id', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const { body: createdUserRequestBody } = await request.post('/api/users').send(createUserRequest);

      const getResponse = await request.get(`/api/users/${createdUserRequestBody.id}`);

      expect(getResponse.status).toBe(HttpStatusCodes.OK);
      expect(getResponse.body).toEqual(createdUserRequestBody);
    });
  });

  describe('PUT /users/:id', () => {
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

      const { body: createdUserRequestBody } = await request.post('/api/users').send(createUserRequest);

      const putResponse = await request.put(`/api/users/${createdUserRequestBody.id}`).send(updateUserRequest);

      expect(putResponse.status).toBe(HttpStatusCodes.OK);
      expect(putResponse.body).toEqual({
        id: createdUserRequestBody.id,
        ...updateUserRequest,
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should_delete_user_from_store_and_returns_204_status', async () => {
      const createUserRequest: UserDto = {
        username: 'username',
        age: 1,
        hobbies: ['hobby'],
      };

      const { body: createdUserRequestBody } = await request.post('/api/users').send(createUserRequest);

      const deleteResponse = await request.delete(`/api/users/${createdUserRequestBody.id}`);

      expect(deleteResponse.status).toBe(HttpStatusCodes.NO_CONTENT);
    });
  });
});
