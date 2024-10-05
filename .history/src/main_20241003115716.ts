import {fetchData} from './functions';
import {UpdateResult} from './interfaces/UpdateResult';
import {UploadResult} from './interfaces/UploadResult';
import {LoginUser, UpdateUser, User} from './interfaces/User';
import {apiUrl, uploadUrl} from './variables';

// PWA code

// select forms from the DOM
const loginForm = document.querySelector(
  '#login-form'
) as HTMLFormElement | null;
const profileForm = document.querySelector(
  '#profile-form'
) as HTMLFormElement | null;
const avatarForm = document.querySelector(
  '#avatar-form'
) as HTMLFormElement | null;

// select inputs from the DOM
const usernameInput = document.querySelector(
  '#username'
) as HTMLInputElement | null;
const passwordInput = document.querySelector(
  '#password'
) as HTMLInputElement | null;

const profileUsernameInput = document.querySelector(
  '#profile-username'
) as HTMLInputElement | null;
const profileEmailInput = document.querySelector(
  '#profile-email'
) as HTMLInputElement | null;

// select profile elements from the DOM
const usernameTarget = document.querySelector(
  '#username-target'
) as HTMLSpanElement | null;
const emailTarget = document.querySelector(
  '#email-target'
) as HTMLSpanElement | null;
const avatarTarget = document.querySelector(
  '#avatar-target'
) as HTMLImageElement | null;

// logout button
const logoutButton = document.querySelector(
  '#logout'
) as HTMLButtonElement | null;

logoutButton?.addEventListener('click', () => {
  localStorage.removeItem('token');
  if (!emailTarget || !usernameTarget || !avatarTarget) {
    return;
  }
  emailTarget.innerText = '';
  usernameTarget.innerText = '';
  avatarTarget.src = '';
});

const newError = (message: string): void => {
  alert(message);
  console.error(message);
};

// function to login
const login = async (): Promise<LoginUser> => {
  if (!usernameInput || !passwordInput) {
    throw new Error('Element not found');
  }
  const username = usernameInput.value;
  const password = passwordInput.value;

  const data = {
    username,
    password,
  };

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const result = await fetchData<LoginUser>(apiUrl + '/auth/login', options);
  return result;
};

// function to update user data
const updateUserData = async (
  user: UpdateUser,
  token: string
): Promise<UpdateResult> => {
  const options: RequestInit = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(user),
  };

  try {
    const updateResult = await fetchData<UpdateResult>(
      apiUrl + '/users',
      options
    );
    return updateResult;
  } catch (error) {
    newError((error as Error).message);
    throw error;
  }
};

// function to add userdata (email, username and avatar image) to the
// Profile DOM and Edit Profile Form
const addUserDataToDom = (user: User): void => {
  if (!usernameTarget || !emailTarget || !avatarTarget) {
    newError('Failed to update profile elements');
    return;
  }
  emailTarget.innerText = user.email;
  usernameTarget.innerText = user.username;
  avatarTarget.src = uploadUrl + user.avatar;
};

// function to get userdata from API using token

const getUserData = async (token: string): Promise<User> => {
  const options: RequestInit = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  return await fetchData<User>(apiUrl + '/users/token', options);
};

// function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom

const checkToken = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found');
    return;
  }

  const user = await getUserData(token);
  addUserDataToDom(user);
};

// call checkToken on page load to check if token exists and update the DOM
checkToken();

// login form event listener
// event listener should call login function and save token to local storage
// then call addUserDataToDom to update the DOM with the user data

if (loginForm) {
  loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    try {
      const loginResult = await login();
      console.log(loginResult);
      localStorage.setItem('token', loginResult.token);
      addUserDataToDom(loginResult.data);
    } catch (error) {
      newError((error as Error).message);
    }
  });
}

// profile form event listener
// event listener should call updateUserData function and update the DOM with
// the user data by calling addUserDataToDom or checkToken

if (profileForm) {
  profileForm.addEventListener('submit', async (evt) => {
    try {
      evt.preventDefault();

      const token = localStorage.getItem('token');
      if (!token) {
        newError('Token not found');
        return;
      }

      if (!profileUsernameInput || !profileEmailInput) {
        throw new Error('Element not found');
      }

      const username = profileUsernameInput.value;
      const email = profileEmailInput.value;

      const data = {
        username,
        email,
      };

      const userResponse = await updateUserData(data, token);
      addUserDataToDom(userResponse.data);
      alert('Profile updated');
    } catch (error) {
      newError((error as Error).message);
    }
  });
}

// avatar form event listener
// event listener should upload Avatar and update the DOM with
// the user data by calling addUserDataToDom or checkToken
if (avatarForm) {
  avatarForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      newError('Token not found');
      return;
    }

    const fd = new FormData(avatarForm);

    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: fd,
    };

    try {
      const uploadResult = await fetchData<UploadResult>(
        apiUrl + '/users/avatar',
        options
      );
      console.log(uploadResult);
      if (uploadResult) {
        await checkToken();
      } else {
        newError('Failed to upload avatar');
      }
    } catch (error) {
      newError((error as Error).message);
    }
  });
}
