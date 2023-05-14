class AddedThread {
  id: number;
  title: string;
  body: string;
  slug: string;

  constructor(payload: { id: number; title: string; body: string, slug: string }) {
    const { id, title, body, slug } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.slug = slug;
  }
}

export default AddedThread;