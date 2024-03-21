## What is the IRA Project?

The IRA project is an exploration to use AI and LLMS to build a learner centric technology that can help users develop a stronger sense of their own epistemology and improve metacognition. By building an AI buddy that users can teach we hope that they can learn from the mistakes that their buddy makes and build a stronger understanding.

## What is this repository? What is the tech stack?

This repository contains the web application MVP of this project. It's built using the [T3 Stack](https://create.t3.gg/). Given below is some of the reasoning and limitations behind the technologies used.

- [Next.js](https://nextjs.org) - Next enables us to start quickly and get set up while also scaling quite well. I've tried to use a SSR wherever possible though this is an area that can be improved. One limitation with NextJS is that we're going to limited to a certain degree on API timeouts. The hard 60 second vercel limit can be a challenge for some time consuming AI endpoints and might require us to set up streaming for those end points.
- [NextAuth.js](https://next-auth.js.org) - NextAuth makes life really easy but we were forced to use both a DB and JWT strategy for our authentication which can be a bit confusing. I wanted to have our DB store the users but JWT was needed to ensure that our middleware worked well and we could leverage Next's built in capabilities.
- [Prisma](https://prisma.io) - Prisma is our ORM of choice. It works well with the rest of the stack and allows us to leverage type safety.
- [Tailwind CSS](https://tailwindcss.com) - Not much to say here other than the fact that Tailwind is really comfortable and easy to use.
- [tRPC](https://trpc.io) - TRPC allows to keep the TypeSafety across the front end and backend. Type safety across the project has been something I've really enjoyed and I've continued the practice.

## Can I fork this repository or use this code?

Feel free to use this codebase any which way you like. However, this codebase may not be as helpful without an understanding of how we're using OpenAI API. Do reach out if you'd like to learn more or want to get involved.

## Where's the rest of the project?

This repository only caontains our consumer facing web application. Currently we're using the OpenAPI and are working towards fine tuning models and assistants to help build the AI buddy. You can find a detailed description of the experiments and approaches we're taking along with the current roadmap. [here](https://github.com/Bodhi-Edict/lastword).

## Some things to keep in mind

- The list of subjects in the home page is generated statically at build time. We don't envision this to change very much and that is the reason for this choice. When a new subject is added or a subject is removed we must rebuild the project.

## Contact

To learn more please contact vig9295@gmail.com.
