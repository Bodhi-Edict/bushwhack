import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // await createSubjects();
  // await createProbabilityTest();
  // await printExplanations();
}

async function createSubjects() {
  await prisma.subject.createMany({
    data: [
        {
          name: 'Mathematics',
          iconUrl: 'https://bushwhack-ira-project.s3.ap-south-1.amazonaws.com/maths.svg',
          description: 'Mathematics is the study of numbers, shapes and patterns. Learn concepts like probability, statistics, linear equations, calculus and more.',
          slug: 'mathematics'
        },
        {
          name: 'Physics',
          iconUrl: 'https://bushwhack-ira-project.s3.ap-south-1.amazonaws.com/physics.svg', 
          description: 'Physics is the study of the fundamental laws of nature. Learn concepts like motion, energy, force, waves, electricity and more.',
          slug: 'physics'
        },
        {
          name: 'Chemistry',
          iconUrl: 'https://bushwhack-ira-project.s3.ap-south-1.amazonaws.com/chemistry.svg',
          description: 'Chemistry is the study of matter and the changes it undergoes. Learn concepts like the periodic table, atoms, molecules, chemical reactions, acids, bases and more.',
          slug: 'chemistry'
        }
    ]
  });
}

async function createProbabilityTest() {
  const probabilityTest = await prisma.test.create({
    data: {
      name: 'Probability',
      instructions: 'This test consists of five questions. Explain the concepts of probability to your study buddy. Test your against each question. Once you have completed the test and satisfied that your explanation works for all questions submit the test.',
      userId: 'clu1jbkn30000q42z0uxenvi8',
      subjectId: 'clu1gyeeg0000rpa6vcy0olil',
      imageUrl: 'https://bushwhack-ira-project.s3.ap-south-1.amazonaws.com/math-tests/Probability.webp'
    }
  });

  await prisma.question.createMany({
    data: [
      {
        testId: probabilityTest.id,
        title: 'In a single throw of a dice, find the probability of getting a number greater than 2',
        correctValues: ['2/3', '4/6'],
      },
      {
        testId: probabilityTest.id,
        title: 'The total outcomes to throw three dice simultaneously is ____',
        correctValues: ['216'],
      },
      {
        testId: probabilityTest.id,
        title: "Ashley's class is doing experiments with probability. They have a box with 3 green balls, 2 blue balls, and 5 red balls. Ashley takes a ball from the box, keeps the ball, and passes the box to Manuel. What is the probability that Ashley gets a blue ball and Manuel gets a green ball?",
        correctValues: ['1/15'],
      },
      {
        testId: probabilityTest.id,
        title: "There is a room full of 50 people. What is the probability that at least two people have the same birthday?",
        correctValues: ['0.97'],
      },
    ]
  })

}

async function printExplanations() {
  const explanations = await prisma.explanation.findMany({
  });

  for (const explanation of explanations) {
    console.log(explanation.text);
  }
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