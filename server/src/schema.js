// const {
//   intArg,
//   makeSchema,
//   nonNull,
//   objectType,
//   stringArg,
//   inputObjectType,
//   arg,
//   asNexusMethod,
//   enumType,
// } = require('nexus')
// const { DateTimeResolver } = require('graphql-scalars')

// const DateTime = asNexusMethod(DateTimeResolver, 'date')

// const Query = objectType({
//   name: 'Query',
//   definition(t) {
//     t.nonNull.list.nonNull.field('allUsers', {
//       type: 'User',
//       resolve: (_parent, _args, context) => {
//         return context.prisma.user.findMany()
//       },
//     })

//     t.nullable.field('postById', {
//       type: 'Post',
//       args: {
//         id: stringArg(),
//       },
//       resolve: (_parent, args, context) => {
//         return context.prisma.post.findUnique({
//           where: { id: args.id || undefined },
//         })
//       },
//     })

//     t.nonNull.list.nonNull.field('feed', {
//       type: 'Post',
//       args: {
//         searchString: stringArg(),
//         skip: intArg(),
//         take: intArg(),
//         orderBy: arg({
//           type: 'PostOrderByUpdatedAtInput',
//         }),
//       },
//       resolve: (_parent, args, context) => {
//         const or = args.searchString
//           ? {
//               OR: [
//                 { title: { contains: args.searchString } },
//                 { content: { contains: args.searchString } },
//               ],
//             }
//           : {}

//         return context.prisma.post.findMany({
//           where: {
//             published: true,
//             ...or,
//           },
//           take: args.take || undefined,
//           skip: args.skip || undefined,
//           orderBy: args.orderBy || undefined,
//         })
//       },
//     })

//     t.list.field('draftsByUser', {
//       type: 'Post',
//       args: {
//         userUniqueInput: nonNull(
//           arg({
//             type: 'UserUniqueInput',
//           }),
//         ),
//       },
//       resolve: (_parent, args, context) => {
//         return context.prisma.user
//           .findUnique({
//             where: {
//               id: args.userUniqueInput.id || undefined,
//               email: args.userUniqueInput.email || undefined,
//             },
//           })
//           .posts({
//             where: {
//               published: false,
//             },
//           })
//       },
//     })
//   },
// })

// const Mutation = objectType({
//   name: 'Mutation',
//   definition(t) {
//     t.nonNull.field('signupUser', {
//       type: 'User',
//       args: {
//         data: nonNull(
//           arg({
//             type: 'UserCreateInput',
//           }),
//         ),
//       },
//       resolve: (_, args, context) => {
//         const postData = args.data.posts
//           ? args.data.posts.map((post) => {
//               return { title: post.title, content: post.content || undefined }
//             })
//           : []
//         return context.prisma.user.create({
//           data: {
//             name: args.data.name,
//             email: args.data.email,
//             posts: {
//               create: postData,
//             },
//           },
//         })
//       },
//     })

//     t.field('createDraft', {
//       type: 'Post',
//       args: {
//         data: nonNull(
//           arg({
//             type: 'PostCreateInput',
//           }),
//         ),
//         authorEmail: nonNull(stringArg()),
//       },
//       resolve: (_, args, context) => {
//         return context.prisma.post.create({
//           data: {
//             title: args.data.title,
//             content: args.data.content,
//             author: {
//               connect: { email: args.authorEmail },
//             },
//           },
//         })
//       },
//     })

//     t.field('togglePublishPost', {
//       type: 'Post',
//       args: {
//         id: nonNull(stringArg()),
//       },
//       resolve: async (_, args, context) => {
//         const post = await context.prisma.post.findUnique({
//           where: { id: args.id || undefined },
//           select: {
//             published: true,
//           },
//         })

//         if (!post) {
//           throw new Error(
//             `Post with ID ${args.id} does not exist in the database.`,
//           )
//         }

//         return context.prisma.post.update({
//           where: { id: args.id || undefined },
//           data: { published: !post.published },
//         })
//       },
//     })

//     t.field('incrementPostViewCount', {
//       type: 'Post',
//       args: {
//         id: nonNull(stringArg()),
//       },
//       resolve: (_, args, context) => {
//         return context.prisma.post.update({
//           where: { id: args.id || undefined },
//           data: {
//             viewCount: {
//               increment: 1,
//             },
//           },
//         })
//       },
//     })

//     t.field('deletePost', {
//       type: 'Post',
//       args: {
//         id: nonNull(stringArg()),
//       },
//       resolve: (_, args, context) => {
//         return context.prisma.post.delete({
//           where: { id: args.id },
//         })
//       },
//     })
//   },
// })

// const User = objectType({
//   name: 'User',
//   definition(t) {
//     t.nonNull.string('id')
//     t.string('name')
//     t.nonNull.string('email')
//     t.nonNull.list.nonNull.field('posts', {
//       type: 'Post',
//       resolve: (parent, _, context) => {
//         return context.prisma.user
//           .findUnique({
//             where: { id: parent.id || undefined },
//           })
//           .posts()
//       },
//     })
//   },
// })

// const Post = objectType({
//   name: 'Post',
//   definition(t) {
//     t.nonNull.string('id')
//     t.nonNull.field('createdAt', { type: 'DateTime' })
//     t.nonNull.field('updatedAt', { type: 'DateTime' })
//     t.nonNull.string('title')
//     t.string('content')
//     t.nonNull.boolean('published')
//     t.nonNull.int('viewCount')
//     t.field('author', {
//       type: 'User',
//       resolve: (parent, _, context) => {
//         return context.prisma.post
//           .findUnique({
//             where: { id: parent.id || undefined },
//           })
//           .author()
//       },
//     })
//   },
// })

// const SortOrder = enumType({
//   name: 'SortOrder',
//   members: ['asc', 'desc'],
// })

// const PostOrderByUpdatedAtInput = inputObjectType({
//   name: 'PostOrderByUpdatedAtInput',
//   definition(t) {
//     t.nonNull.field('updatedAt', { type: 'SortOrder' })
//   },
// })

// const UserUniqueInput = inputObjectType({
//   name: 'UserUniqueInput',
//   definition(t) {
//     t.string('id')
//     t.string('email')
//   },
// })

// const PostCreateInput = inputObjectType({
//   name: 'PostCreateInput',
//   definition(t) {
//     t.nonNull.string('title')
//     t.string('content')
//   },
// })

// const UserCreateInput = inputObjectType({
//   name: 'UserCreateInput',
//   definition(t) {
//     t.nonNull.string('email')
//     t.string('name')
//     t.list.nonNull.field('posts', { type: 'PostCreateInput' })
//   },
// })

// const schema = makeSchema({
//   types: [
//     Query,
//     Mutation,
//     Post,
//     User,
//     UserUniqueInput,
//     UserCreateInput,
//     PostCreateInput,
//     SortOrder,
//     PostOrderByUpdatedAtInput,
//     DateTime,
//   ],
//   outputs: {
//     schema: __dirname + '/../schema.graphql',
//     typegen: __dirname + '/generated/nexus.ts',
//   },
//   sourceTypes: {
//     modules: [
//       {
//         module: '@prisma/client',
//         alias: 'prisma',
//       },
//     ],
//   },
// })

// module.exports = {
//   schema: schema,
// }












const {
  makeSchema,
  nonNull,
  objectType,
  asNexusMethod,
  enumType,
  stringArg
} = require('nexus');
const { DateTimeResolver } = require('graphql-scalars');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context) => {
        return context.prisma.user.findMany();
      },
    });
    t.nonNull.list.nonNull.field('allConferences', {
      type: 'Conference',
      resolve: (_parent, _args, context) => {
        return context.prisma.conference.findMany();
      },
    }),
    t.nonNull.field("conference",{
      type: "Conference",
      args: {
        conferenceId: nonNull(stringArg())
      },
      resolve: async (_parent, args, context) => {
        return context.prisma.conference.findUnique({
          where: {id: args.conferenceId}
        })
      }
    })
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('updateUser', {
      type: 'User',
      args: {
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
        userId: nonNull(stringArg())
      },
      resolve: async (_parent, args, context) => {
        return context.prisma.user.update({
          where: {
            id: args.userId,
          },
          data: {
            username: args.username,
            email: args.email
          },
        })
      },
    });
    t.field('signupUser', {
      type: 'User',
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context) => {
        const password = await bcrypt.hash(args.password, 10);
        const username = String(args.username).toLowerCase();
        if(username?.length){
          const user = await context.prisma.user.findUnique({
            where: { username },
          })
          if (user) {
            throw new Error("User already exists");
          }
          return context.prisma.user.create({
            data: {
              username,
              password,
              bio: "",
              email: ""
            },
          });
        }else{
          throw new Error("Username cannot be empty");
        }
      },
    });
    t.nonNull.field("loginUser", {
      type: "Login",
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context) => {
        const username = String(args.username).toLowerCase();
        const user = await context.prisma.user.findUnique({
          where: { username },
        });
        if (!user) {
          throw new Error("No user found");
        }
        const isValid = await bcrypt.compare(args.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return {
          token: jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' }),
          user,
        };
      }
    })
    t.field('joinConference', {
      type: 'ConferenceUser',
      args: {
        userId: nonNull(stringArg()),
        conferenceId: nonNull(stringArg()),
        role: nonNull(Status)
      },
      resolve: async (_parent, args, context) => {
        return context.prisma.conferenceUser.create({
          data: {
            userId: args.userId,
            conferenceId: args.conferenceId,
            role: args.role
          }
        })
      }
    })
    t.field('createConference', {
      type: 'Conference',
      args: {
        name: nonNull(stringArg()),
        location: nonNull(stringArg()),
        creatorId: nonNull(stringArg()),
        startDate: nonNull(stringArg()),
        endDate: nonNull(stringArg()),
        description: stringArg()
      },
      resolve: async (_parent, args, context) => {
        return context.prisma.conference.create({
          data: {
            name: args.name,
            location: args.location,
            creatorId: args.creatorId,
            startDate: args.startDate,
            endDate: args.endDate,
            description: args.description
          }
        })
      }
    })
  },
});

// Add email and email validation
// Add description to Conference
const Conference = objectType({
  name: "Conference",
  definition(t) {
    t.nonNull.string("id")
    t.string("name")
    t.string("location")
    t.string("startDate")
    t.string("endDate")
    t.string("creatorId")
    t.string("description")
    t.nonNull.field("creator", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.conference
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .creator()
      },
    })
    t.list.nonNull.field("users", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.conference
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .users()
      },
    })
    t.list.nonNull.field('conferenceUsers', {
      type: 'ConferenceUser',
      resolve: (parent, _, context) => {
        return context.prisma.conference
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .conferenceUsers()
      },
    })
    t.field("weather", {
      type: "Weather",
      resolve: (parent, _, context) => {
        return context.prisma.conference
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .weather()
      },
    })
  }
})

const Status = enumType({
  name: "Status",
  members: ["attendee", "speaker"]
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('username')
    t.nonNull.string("password")
    t.string("createdAt")
    t.string("updatedAt")
    t.string("email")
    t.list.nonNull.field('createdConferences', {
      type: 'Conference',
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .conferences()
      },
    })
    t.list.nonNull.field('conferences', {
      type: 'ConferenceUser',
      resolve: (parent, _, context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .conferenceUsers()
      },
    })
    t.string("bio")
  },
})

// Change to many to one for weather
const Weather = objectType({
  name: "Weather",
  definition(t) {
    t.nonNull.string("id")
    t.nonNull.field("conference", {
      type: "Conference",
      resolve: (parent, _, context) => {
        return context.prisma.weather
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .conference()
      },
    })
    t.string("conferenceId")
    t.float("temperature")
    t.string("description")
  }
})

const Login = objectType({
  name: "Login",
  definition(t) {
    t.string("token")
    t.nonNull.field("user", { type: "User" })
  }
})

const ConferenceUser = objectType({
  name: "ConferenceUser",
  definition(t) {
    t.nonNull.string("id")
    t.string("conferenceId")
    t.string("userId")
    t.nonNull.field('role', { type: 'Status' })
    t.nonNull.field("conference", {
      type: "Conference",
      resolve: (parent, _, context) => {
        return context.prisma.conferenceUser
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .conference()
      },
    })
    t.nonNull.field("user", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.conferenceUser
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .user()
      }, 
    })
  }
})

const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Status,
    User,
    Login,
    Weather,
    Conference,
    DateTime,
    ConferenceUser
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

module.exports = {
  schema
};
