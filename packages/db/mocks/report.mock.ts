import { type Report, type Prisma, ReportType, ReportStatus, IssueType } from '@prisma/client';
import { faker } from '@faker-js/faker';

export function ReportMock(
  reporterId: string,
  reportType: ReportType,
  id: number | string,
): Prisma.ReportCreateManyInput {
  const data: Prisma.ReportCreateManyInput = {
    type: reportType,
    status: ReportStatus.PENDING,
    reporterId,
    text: faker.lorem.sentences({
      min: 1,
      max: 5,
    }),
  };
  switch (reportType) {
    case 'CHALLENGE':
      data.challengeId = id as number;
      break;
    case 'COMMENT':
      data.commentId = id as number;
      break;
    case 'SOLUTION':
      data.solutionId = id as number;
      break;
    case 'USER':
      data.userId = id as string;
      break;
  }
  return data;
}
