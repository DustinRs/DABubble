export class Channel {
    name: string;
    description: string;
    link = 'channel';
    id: string;
    messages: [];
    timestamps: [];
    users: [];
    
  
    constructor(obj?: any) {
      this.name = obj ? obj.name : ''; // if else
      this.description = obj ? obj.description : '';
      this.link = obj ? obj.link : '';
      this.id = obj ? obj.id : '';
      this.messages = obj ? obj.messages : '';
      this.timestamps = obj ? obj.timestamp : '';
      this.users = obj ? obj.users : '';
    }
  
    asJson() {
      return {
        name: this.name,
        description: this.description,
        id: this.id,
        link: 'channel',
        messages: [],
        timestamps: [],
        users: [],
      };
    }
  }