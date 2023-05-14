class GettedUser {
    id: number;
    username: string;
    createdAt: Date;
  
    constructor(payload: { id: number; username: string, createdAt: Date }) {
      const { id, username, createdAt } = payload;
      this.id = id;
      this.username = username;
      this.createdAt = createdAt;
    }
  }
  
  export default GettedUser;