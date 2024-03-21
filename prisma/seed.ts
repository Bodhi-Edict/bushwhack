import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await createSubjects();
}

async function createSubjects() {
  const users = await prisma.user.findMany();
  for(const user of users) {
    console.log(user?.email);
  }

  await prisma.subject.createMany({
    data: [
        {
          name: 'Mathematics',
          iconUrl: 'https://bushwhack-ira-project.s3.ap-south-1.amazonaws.com/maths.svg',
          description: 'Mathematics is the study of numbers, shapes and patterns. Learn concepts like probability, statistics, linear equations, calculus and more.'
        },
        {
          name: 'Physics',
          iconUrl: 'https://bushwhack-ira-project.s3.ap-south-1.amazonaws.com/physics.svg', 
          description: 'Physics is the study of the fundamental laws of nature. Learn concepts like motion, energy, force, waves, electricity and more.'
        },
        {
          name: 'Chemistry',
          iconUrl: 'https://bushwhack-ira-project.s3.ap-south-1.amazonaws.com/chemistry.svg',
          description: 'Chemistry is the study of matter and the changes it undergoes. Learn concepts like the periodic table, atoms, molecules, chemical reactions, acids, bases and more.'
        }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })