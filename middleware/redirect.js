export default function ({ route, redirect }) {
  const unprotectedPaths = [
    '/login',
  ]

  const url = decodeURI(route.path)
  if (!unprotectedPaths.find(path => url.startsWith(path))) {
    if (!localStorage.getItem('JWT')) {
      return redirect('/login')
    }
  }
}
