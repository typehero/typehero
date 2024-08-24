# Going to have to use a custom image for this
# and just install the stuff that EC2 requires.
#
FROM public.ecr.aws/lambda/nodejs:20
# Do this
RUN corepack enable pnpm
COPY dist/index.js ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
