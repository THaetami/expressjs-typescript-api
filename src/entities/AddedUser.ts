class AddedUser {
    id: number;
    username: string;
  
    constructor(payload: { id: number; username: string }) {
      const { id, username } = payload;
      this.id = id;
      this.username = username;
    }
  }
  
  export default AddedUser;