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
					NEXT_PUBLIC_STAGE: stage
				}
			})

			stack.addOutputs({
				WebUrl: site.url
			})
		})
	}
}
