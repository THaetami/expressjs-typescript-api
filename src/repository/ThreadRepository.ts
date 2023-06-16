import { Sequelize } from "../db/models";
const db = require('../db/models');
const { Op } = require('sequelize');

class ThreadRepository {
    static async getThreads(page = 1, limit = 10) {
        try {
            const totalCount = await db.thread.count();
        
            const threads = await db.thread.findAll({
                include: [
                    {
                        model: db.user,
                        attributes: ['id', 'username']
                    },
                    {
                        model: db.comment,
                        attributes: []
                    },
                    {
                        model: db.like,
                        attributes: []
                    }
                ],
                attributes: [
                    'id',
                    'title',
                    'body',
                    'slug',
                    'updated_at',
                    'created_at',
                    [
                        Sequelize.fn('COUNT', Sequelize.literal('DISTINCT comments.id')),
                        'comment_count'
                    ],
                    [
                        Sequelize.fn('COUNT', Sequelize.literal('DISTINCT likes.id')),
                        'like_count'
                    ]
                ],
                subQuery: false,
                group: ['thread.id', 'user.id'],
                order: [['created_at', 'DESC']],
                offset: (page - 1) * limit,
                limit: limit
            });
        
            return {
                threads,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount
            };
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async getThreadByUserId(page = 1, limit = 10, userId: number) {
        try {
          const totalCount = await db.thread.count({
            where: { user_id: userId },
          });
      
          const threads = await db.thread.findAll({
            where: { user_id: userId },
            include: [
              {
                model: db.user,
                attributes: ['id', 'username'],
              },
              {
                model: db.comment,
                attributes: [],
              },
              {
                model: db.like,
                attributes: [],
              },
            ],
            attributes: [
              'id',
              'title',
              'body',
              'slug',
              'updated_at',
              'created_at',
              [
                Sequelize.fn('COUNT', Sequelize.literal('DISTINCT comments.id')),
                'comment_count',
              ],
              [
                Sequelize.fn('COUNT', Sequelize.literal('DISTINCT likes.id')),
                'like_count',
              ],
            ],
            subQuery: false,
            group: ['thread.id', 'user.id'],
            order: [['created_at', 'DESC']],
            offset: (page - 1) * limit,
            limit: limit,
          });
      
          return {
            threads,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
          };
        } catch (err) {
          console.error(err);
          return null;
        }
    }

    
static async getThreadByUserIdAndThreadId(page = 1, limit = 10, threadIds: any) {
    try {
      const totalCount = await db.thread.count({
        where: { id: { [Op.in]: threadIds } },
      });
  
      const threads = await db.thread.findAll({
        where: { id: { [Op.in]: threadIds } },
        include: [
          {
            model: db.user,
            attributes: ['id', 'username'],
          },
          {
            model: db.comment,
            attributes: [],
          },
          {
            model: db.like,
            attributes: [],
          },
        ],
        attributes: [
          'id',
          'title',
          'body',
          'slug',
          'updated_at',
          'created_at',
          [
            Sequelize.fn('COUNT', Sequelize.literal('DISTINCT comments.id')),
            'comment_count',
          ],
          [
            Sequelize.fn('COUNT', Sequelize.literal('DISTINCT likes.id')),
            'like_count',
          ],
        ],
        subQuery: false,
        group: ['thread.id', 'user.id'],
        order: [['created_at', 'DESC']],
        offset: (page - 1) * limit,
        limit: limit,
      });
  
      return {
        threads,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
      

    static async addThread(user_id: number, slug: string, title: string, body: string) {
        try {
            const result = await db.thread.create({ user_id, slug, title, body });
            return result ? result : false;
        } catch (err) {
            console.error(err);
        }
    }

    static async getDetailThread(id: number) {
        try {
            const thread = await db.thread.findOne({
                where: { id },
                include: [
                    {
                        model: db.user,
                        attributes: ['id', 'username']
                    },
                    {
                        model: db.comment,
                        attributes: ['id', 'comentar', 'created_at', 'thread_id'],
                        include: {
                            model: db.user,
                            attributes: ['id', 'username']
                        },
                    },
                    {
                        model: db.like,
                        attributes: ['thread_id'],
                        include: {
                            model: db.user,
                            attributes: ['id', 'username']
                        }
                    }
                ],
                attributes: [
                    'id',
                    'title',
                    'body',
                    'slug',
                    'updated_at',
                ],
                subQuery: false,
                group: ['thread.id', 'user.id', 'comments.id', 'comments.user.id', 'likes.user.id'],
            });
            return thread ? thread : false;
        } catch (err) {
            console.error(err);
        }
    }
    
    
    public static async getThreadBySlug(slug: string) {
        try {
            const thread = await db.thread.findOne({ where: { slug: slug }  });
            return thread ? thread : false;
        } catch (err) {
            console.error(err);
        }
    }

    public static async getThreadById(id: number) {
        try {
            const thread = await db.thread.findOne({ where: { id: id } });
            return thread ? thread : false;
        } catch (err) {
            console.error(err);
        }
    }

    public static async updateThread(id: Number, title: string, body: string) {
        try {
            await db.thread.update(
                { title, body },
                { where: { id: id } }
            );
        } catch (err) {
            console.error(err);
        }
    }

    public static async deleteThread(id: Number) {
        try {
            await db.thread.destroy({
                where: { id: id },
            });
        } catch (err) {
            console.error(err);
        }
    }

    public static async deleteThreadByUserId(user_id: Number) {
        try {
            await db.thread.destroy({
                where: { user_id: user_id },
            });
        } catch (err) {
            console.error(err);
        }
    }

    
    public static async reactivateThread(user_id: number, deleted_at: string) {
        try {
            await db.thread.update({ deleted_at: null }, { where: { user_id, deleted_at }, paranoid: false });
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}

export default ThreadRepository;