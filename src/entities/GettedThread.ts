class GettedThread {
    id: number;
    user_id: number;
    slug: string;
    title: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor(payload: { id: number; user_id: number, slug: string, title: string, body: string, createdAt: Date, updatedAt: Date }) {
      const { id, user_id, slug, title, body, createdAt, updatedAt } = payload;
      this.id = id;
      this.user_id = user_id;
      this.slug = slug;
      this.title = title;
      this.body = body;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  
  export default GettedThread;