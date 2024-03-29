export class User {
  Name: string;
  password: string;
  email: string;
  id: string;
  avatar: string;
  Job: 'Student';
  online: 'online';

  constructor(obj?: any) {
    this.Name = obj ? obj.Name : ''; // if else
    this.password = obj ? obj.password : '';
    this.email = obj ? obj.email : '';
    this.id = obj ? obj.id : '';
    this.avatar = obj ? obj.avatar : '';
    this.Job = obj ? obj.Job : '';
    this.online = obj ? obj.online : '';
  }

  asJSON() {
    return {
      Name: this.Name,
      password: this.password,
      email: this.email,
      id: this.id,
      avatar: this.avatar,
      Job: 'Student',
      online: 'online'
    };
  }
}
