import * as React from 'react'
import {sortBy} from 'lodash'
import Link from 'next/link'
import {FunctionComponent} from 'react'
import {GetStaticProps} from 'next'
import Image from 'next/image'

import tags from 'pages/site-directory/tags.json'

type TagsProps = {
  tags: any[]
}

const Tags: FunctionComponent<TagsProps> = ({tags}) => {
  return (
    <div className="max-w-screen-xl grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 grid-cols-2 sm:gap-5 gap-4 mx-auto sm:pb-16 pb-8">
      {tags.map((tag) => {
        return (
          <div className="flex justify-center" key={tag.slug}>
            <Link href={`/q/${tag.slug}`}>
              <a className="space-x-2 flex flex-row items-center justify-start rounded-lg hover:shadow-sm border border-transparent hover:border-gray-200 sm:p-5 p-4 w-full transition-all ease-in-out duration-150">
                {tag.image_64_url && (
                  <Image
                    quality={100}
                    src={tag.image_64_url}
                    alt={tag.label}
                    width={64}
                    height={64}
                  />
                )}
                <span className="font-medium leading-tight">{tag.label}</span>
              </a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Tags

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      tags: sortBy(tags, ['name']),
    },
  }
}
