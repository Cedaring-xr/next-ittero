import { StackContext, NextjsSite } from 'sst/constructs'

export default {
	config() {
		return {
			name: 'ittero-web',
			region: 'us-east-1'
		}
	},

	stacks(app: any) {
		app.stack(function Web({ stack }: StackContext) {
			const stage = app.stage // "staging" | "prod"

			const site = new NextjsSite(stack, 'Web', {
  				path: '.',
				environment: {
					NEXT_PUBLIC_STAGE: stage,
					TASKS_API_GATEWAY_LISTS_URL:
    					stage === "prod"
      				? "https://em3d616fz6.execute-api.us-east-1.amazonaws.com/prod"
      				: "https://em3d616fz6.execute-api.us-east-1.amazonaws.com/staging",
					},

				customDomain: stage === "prod"
				? {
					domainName: "itteroapp.com",
					hostedZone: "itteroapp.com",
					}
				: undefined,
			})


			stack.addOutputs({
				WebUrl: site.url
			})
		})
	}
}
