import * as struct from 'superstruct'
import isEmail from 'is-email'

export const CreateUser = struct.object({
  email: struct.define('Email', isEmail),
  firstName: struct.size(struct.string(), 1, 10),
  lastName:struct.size(struct.string(), 1, 3),
  address: struct.string(),
})

export const PatchUser = struct.partial(CreateUser)