export class User {
  Name: string;
  password: string;
  email: string;
  id: string;
  avatar: string;

  constructor(obj?: any) {
    this.Name = obj ? obj.Name : ''; // if else
    this.password = obj ? obj.password : '';
    this.email = obj ? obj.email : '';
    this.id = obj ? obj.id : '';
    this.avatar = obj ? obj.avatar : '';
  }

  asJSON() {
    return {
      Name: this.Name,
      password: this.password,
      email: this.email,
      id: this.id,
      avatar: this.avatar,
    };
  }
}
