import request from "supertest";
import { app } from "../../app";
import { signinHelper } from "../../test/signin-helper";

it(('responds with details about the currect user'), async () => {
    // const signupResponse = await request(app)
    // .post("/api/users/signup")
    // .send({
    //     email: "test@test.com",
    //     password: "password"
    // })
    // .expect(201);

    // const cookie = signupResponse.get('Set-Cookie');

    const cookie = await signinHelper();

    const response = await request(app)
    .get("/api/users/currentUser")
    .set('Cookie', cookie)
    .send()
    .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});


it(('responds with null if not authenticated'), async () => {
    const response = await request(app)
    .get("/api/users/currentUser")
    .send()
    .expect(200);

    expect(response.body.currentUser).toEqual(null);
});