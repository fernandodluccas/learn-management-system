const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Remove existing sample courses with the same title to avoid duplicates (optional)
  await prisma.course.deleteMany({ where: { title: { in: ['Curso Exemplo', 'Fullstack Básico'] } } })

  const course = await prisma.course.create({
    data: {
      title: 'Curso Exemplo',
      description: 'Um curso gerado pelo seed com disciplinas e aulas de exemplo.',
      disciplines: {
        create: [
          {
            title: 'Fundamentos de JavaScript',
            lessons: {
              create: [
                { title: 'Introdução ao JavaScript', description: 'Visão geral da linguagem, tipos e sintaxe.' },
                { title: 'Funções e Escopo', description: 'Declaração de funções, arrow functions e hoisting.' },
                { title: 'Assíncrono em JS', description: 'Promises, async/await e callbacks.' },
              ],
            },
          },
          {
            title: 'Introdução ao React',
            lessons: {
              create: [
                { title: 'Componentes e JSX', description: 'Criando componentes funcionais e JSX básico.' },
                { title: 'Estado e Props', description: 'useState, props e composição de componentes.' },
              ],
            },
          },
        ],
      },
    },
    include: { disciplines: { include: { lessons: true } } },
  })

  console.log('Seed finished. Created course id=', course.id)
  console.dir(course, { depth: 4 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
