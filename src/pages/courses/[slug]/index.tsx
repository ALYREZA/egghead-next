import * as React from 'react'
import useSWR from 'swr'
import {loadCourse} from 'lib/courses'
import {loadPlaylist, loadAuthedPlaylistForUser} from 'lib/playlists'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import fetcher from 'utils/fetcher'
import CollectionPageLayout from 'components/layouts/collection-page-layout'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

type CourseProps = {
  course: any
}

const Course: FunctionComponent<CourseProps> = ({course: initialCourse}) => {
  const {data} = useSWR(`${initialCourse.slug}`, loadAuthedPlaylistForUser)

  const course = {...initialCourse, ...data}

  console.debug(`course loaded`, course)

  const {slug, lessons} = course
  const items = get(course, 'items', [])

  const courseLessons = isEmpty(lessons)
    ? filter(items, (item) => {
        return ['lesson', 'talk'].includes(item.type)
      })
    : lessons

  return (
    <CollectionPageLayout
      lessons={courseLessons}
      course={course}
      ogImageUrl={`https://og-image-react-egghead.now.sh/playlists/${slug}?v=20201103`}
    />
  )
}

export default Course

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  const course = params && (await loadPlaylist(params.slug as string))
  if (course && course?.slug !== params?.slug) {
    res.setHeader('Location', course.path)
    res.statusCode = 302
    res.end()
    return {props: {}}
  } else {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return {
      props: {
        course,
      },
    }
  }
}
