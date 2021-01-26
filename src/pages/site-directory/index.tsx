import * as React from 'react'
import Link from 'next/link'

const Index = (props: any) => {
  const tagSlugs: string[] = props.tagSlugs

  return (
    <div className="prose dark:prose-dark">
      <div className="space-y-5">
        <p>
          This is a programmatically generated listing of all the topics and all
          of the combinations of those topics the site has to offer. All of the
          permutations of these topics when combined (to a level of 3) is about
          750,000 individual pages!
        </p>
        <p>
          As a programmer, you might be interested in how this list is generated
          more than the list itself. If so,{' '}
          <a href="https://github.com/eggheadio/egghead-next/blob/4e8472982345f7c4c67f18c774752b26d15e8825/tags-sitemap.js">
            check out the code on Github
          </a>
          . If not, feel free to explore, but it's not likely to be fruitful. We
          use it for generating a comprehensive sitemap. It's kind of weird...
        </p>
        <p>
          Checkout a list of <a href="/playlists">collections</a> or{' '}
          <a href="/courses">courses</a> sorted by the date they were last
          updated.
        </p>
      </div>
      <ul>
        {tagSlugs.map((path) => {
          return (
            <li>
              <Link href={`/site-directory/${path}`} key={path}>
                <a>{path}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export async function getStaticProps(context: any) {
  const tags: any = await import('./tags.json').then((data) => data.default)
  const tagSlugs = tags.map(({slug}: {slug: string}) => slug).sort()

  return {
    props: {tagSlugs},
  }
}

export default Index
