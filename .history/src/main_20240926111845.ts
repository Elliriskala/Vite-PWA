import {fetchData} from './functions';
import {UpdateResult} from './interfaces/UpdateResult';
import {UploadResult} from './interfaces/UploadResult';
import {LoginUser, UpdateUser, User} from './interfaces/User';
import {apiUrl, uploadUrl} from './variables';

// PWA code

// select forms from the DOM
const loginForm = document.querySelector('#login-form') as HTMLFormElement | null;
const profileForm = document.querySelector('#profile-form') as HTMLFormElement | null;
const avatarForm = document.querySelector('#avatar-form') as HTMLFormElement | null;

// select inputs from the DOM
const usernameInput = document.querySelector('#username') as HTMLInputElement | null;
const passwordInput = document.querySelector('#password') as HTMLInputElement | null;

const profileUsernameInput = document.querySelector(
  '#profile-username'
) as HTMLInputElement | null;
const profileEmailInput = document.querySelector(
  '#profile-email'
) as HTMLInputElement | null;

const avatarInput = document.querySelector('#avatar') as HTMLInputElement | null;

// select profile elements from the DOM
const usernameTarget = document.querySelector('#username-target');
const emailTarget = document.querySelector('#email-target');
const avatarTarget = document.querySelector('#avatar-target');

// function to login
const login = async (): Promise<LoginUser> => {
  if (!usernameInput || !passwordInput) {
    throw new Error('Element not found');
  }
  const username = usernameInput.value;
  const password = passwordInput.value;

  const data = {
    username,
    password
  };

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const result = await fetchData<LoginUser>(apiUrl + '/auth/login', options);
  return result;
};

// TODO: function to update user data
const updateUserData = async (
  user: UpdateUser,
  token: string
): Promise<UpdateResult> => {};

// TODO: function to add userdata (email, username and avatar image) to the
// Profile DOM and Edit Profile Form
const addUserDataToDom = (user: User): void => {};

// function to get userdata from API using token
const getUserData = async (token: string): Promise<User> => {};

// TODO: function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom
const checkToken = async (): Promise<void> => {};

// call checkToken on page load to check if token exists and update the DOM
checkToken();

// login form event listener
// event listener should call login function and save token to local storage
// then call addUserDataToDom to update the DOM with the user data

if (loginForm) {
  loginForm.addEventListener('submit', async (evt) => {
    try {
      evt.preventDefault();
      const loginresult = await login();
      console.log(loginresult);
      localStorage.setItem('token', loginresult.token);
    } catch (error) {
      console.log(error);
    }
  });
}

// TODO: profile form event listener
// event listener should call updateUserData function and update the DOM with
// the user data by calling addUserDataToDom or checkToken

// TODO: avatar form event listener
// event listener should call uploadAvatar function and update the DOM with
// the user data by calling addUserDataToDom or checkToken
