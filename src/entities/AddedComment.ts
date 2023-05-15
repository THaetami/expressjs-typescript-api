class AddedComment {
    id: number;
    comentar: string;
    createdAt: Date;
  
    constructor(payload: { id: number; comentar: string; createdAt: Date }) {
      const { id, comentar, createdAt } = payload;
      this.id = id;
      this.comentar = comentar;
      this.createdAt = createdAt;
    }
  }
  
  export default AddedComment;