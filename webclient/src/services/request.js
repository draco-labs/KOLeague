import axiosClient, { serviceClientAirdrop } from './serviceClient'
import axiosClientLogin from './serviceClientLogin'

export async function postAsync(
  url,
  body,
  config = {}
) {
  let response
  try {
    response = await axiosClient(url, {
      method: 'POST',
      data: body,
      ...config
    })
    return Promise.resolve({
      data: response?.data
    })
  } catch (ex) {
    return Promise.resolve({
      data: ex.response?.data
    })
  }
}

export async function postAsyncAirdrop(
  url,
  body,
  config = {}
) {
  let response
  try {
    response = await serviceClientAirdrop(url, {
      method: 'POST',
      data: body,
      ...config
    })
    return Promise.resolve({
      data: response?.data
    })
  } catch (ex) {
    return Promise.resolve({
      data: ex.response?.data
    })
  }
}

export async function postAsyncLogin(
  url,
  body,
  config = {}
) {
  let response
  try {
    response = await axiosClientLogin(url, {
      method: 'POST',
      data: body,
      ...config
    })
    return Promise.resolve({
      data: response?.data
    })
  } catch (ex) {
    return Promise.resolve({
      data: ex.response?.data
    })
  }
}

export async function getAsync(
  url,
  params,
) {
  let response
  try {
    if (params?.signal) {
      response = await axiosClient(url, {
        method: 'GET',
        params,
        signal: params?.signal
      })
    } else response = await axiosClient(url, {
      method: 'GET',
      params
    },
    )
    return Promise.resolve({
      data: response?.data
    })
  } catch (ex) {
    return Promise.resolve({
      data: ex.response?.data
    })
  }
}

export async function getAsyncAirdop(
  url,
  params,
) {
  let response
  try {
    if (params?.signal) {
      response = await serviceClientAirdrop(url, {
        method: 'GET',
        params,
        signal: params?.signal
      })
    } else response = await serviceClientAirdrop(url, {
      method: 'GET',
      params
    },
    )
    return Promise.resolve({
      data: response?.data
    })
  } catch (ex) {
    return Promise.resolve({
      data: ex.response?.data
    })
  }
}

export async function deleteAsync(
  url
) {
  let response
  try {
    response = await axiosClient(url, {
      method: 'DELETE'
    })
    return Promise.resolve({
      data: response?.data
    })
  } catch (ex) {
    return Promise.resolve({
      data: ex.response?.data
    })
  }
}

export async function putAsync(
  url,
  data,
  config = {}
) {
  let response
  try {
    response = await axiosClient(url, {
      method: 'PUT',
      data,
      ...config
    })
    return Promise.resolve({
      data: response?.data
    })
  } catch (ex) {
    return Promise.resolve({
      data: ex.response?.data
    })
  }
}

export async function patchAsync(
  url,
  data,
  config = {}
) {
  let response
  try {
    response = await axiosClient(url, {
      method: 'PATCH',
      data,
      ...config
    })
    return Promise.resolve({
      data: response?.data
    })
  } catch (ex) {
    return Promise.resolve({
      data: ex.response?.data
    })
  }
}
